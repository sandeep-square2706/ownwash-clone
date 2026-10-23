import secrets
from django.contrib.auth import get_user_model
from django.db import transaction
from django.http import FileResponse, Http404
from django.utils import timezone
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from .models import *
from .permissions import IsPartner, IsAdminOrOwner
from .serializers import *

User=get_user_model()

def partner_for(request):
    return getattr(request.user,"partner_profile",None)

def ref():
    return "CKP-" + secrets.token_hex(4).upper()

class PartnerRegisterView(APIView):
    permission_classes=[AllowAny]
    @transaction.atomic
    def post(self, request):
        data=request.data
        email=(data.get("email") or "").strip().lower()
        phone=(data.get("phone") or "").strip()
        if not phone: return Response({"detail":"Phone number is required."},status=400)
        if not email: email=f"{phone}@partner.cleankart.local"
        user=User.objects.filter(email=email).first()
        if user:
            if hasattr(user,"partner_profile"):
                return Response({"detail":"A partner application already exists for this account."},status=400)
            return Response({"detail":"An account already uses this email. Sign in to the existing account or use a different email for partner registration."},status=400)
        username=f"partner_{phone[-10:]}"
        while User.objects.filter(username=username).exists(): username += secrets.token_hex(1)
        user=User.objects.create_user(username=username,email=email,password=data.get("password") or secrets.token_urlsafe(24),phone=phone,role=User.Role.PARTNER)
        p=PartnerProfile.objects.create(
            user=user, partner_type={
                "Individual":"INDIVIDUAL","Service Team":"SOLE_PROPRIETOR","Partner Business":"COMPANY",
                "INDIVIDUAL":"INDIVIDUAL","SOLE_PROPRIETOR":"SOLE_PROPRIETOR","PARTNERSHIP":"PARTNERSHIP","COMPANY":"COMPANY"
            }.get(data.get("type"),"INDIVIDUAL"),
            legal_name=data.get("name") or data.get("legal_name") or "",display_name=data.get("display_name") or data.get("name") or data.get("legal_name") or "",phone=phone,email=email,
            address=" ".join([str(data.get("house", data.get("address", ""))),str(data.get("area",""))]).strip(),city=data.get("city",""),
            district=data.get("district",""),state=data.get("state",""),pincode=data.get("pincode", data.get("postal_code", "")),
            experience=data.get("experience",""),team_size=data.get("team_size") or 1,max_travel_km=data.get("distance", data.get("maximum_travel_distance_km")) or 10,
            working_days=data.get("days", data.get("working_days")) or [],start_time=data.get("start", data.get("start_time")) or None,end_time=data.get("end", data.get("end_time")) or None,
            application_reference=ref(),status=PartnerProfile.Status.SUBMITTED,agreement_version="cleankart-partner-v1" if data.get("agreement") else "",agreement_accepted_at=timezone.now() if data.get("agreement") else None
        )
        for service in data.get("services") or []:
            PartnerService.objects.create(partner=p,service_slug=str(service)[:120])
        PartnerApproval.objects.create(partner=p,actor=user,action=PartnerApproval.Action.SUBMITTED)
        refresh=RefreshToken.for_user(user)
        return Response({"message":"Registration submitted.","application_reference":p.application_reference,"status":p.status,
                         "access":str(refresh.access_token),"refresh":str(refresh),"partner":PartnerProfileSerializer(p).data},status=201)

class PartnerOtpRequestView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        phone=(request.data.get("phone") or "").strip()
        if not phone:return Response({"detail":"Phone number is required."},status=400)
        code="123456"
        from django.core.cache import cache
        cache.set(f"partner_otp:{phone}",code,300)
        payload={"message":"OTP sent."}
        from django.conf import settings
        if settings.DEBUG: payload["development_otp"]=code
        return Response(payload)

class PartnerOtpVerifyView(APIView):
    permission_classes=[AllowAny]
    def post(self,request):
        phone=(request.data.get("phone") or "").strip()
        code=(request.data.get("otp") or "").strip()
        from django.core.cache import cache
        if cache.get(f"partner_otp:{phone}") != code:
            return Response({"detail":"Invalid or expired OTP."},status=400)
        user=User.objects.filter(phone=phone,role=User.Role.PARTNER).first()
        if not user:return Response({"detail":"No CleanKart partner account found for this phone."},status=404)
        refresh=RefreshToken.for_user(user)
        return Response({"access":str(refresh.access_token),"refresh":str(refresh),"message":"Login successful."})

class PartnerMeView(APIView):
    permission_classes=[IsPartner]
    def get(self,request): return Response(PartnerProfileSerializer(partner_for(request)).data)
    def patch(self,request):
        p=partner_for(request); s=PartnerProfileSerializer(p,data=request.data,partial=True); s.is_valid(raise_exception=True); s.save(); return Response(s.data)

class PartnerStatusView(APIView):
    permission_classes=[IsPartner]
    def get(self,request):
        p=partner_for(request)
        return Response({"reference":p.application_reference,"status":p.status,"reason":p.review_reason})

class PartnerDocumentListCreateView(APIView):
    permission_classes=[IsPartner]; parser_classes=[MultiPartParser,FormParser]
    def get(self,request): return Response(PartnerDocumentSerializer(partner_for(request).documents.all(),many=True).data)
    def post(self,request):
        s=PartnerDocumentSerializer(data=request.data); s.is_valid(raise_exception=True); s.save(partner=partner_for(request)); return Response(s.data,status=201)

class PartnerDocumentDownloadView(APIView):
    permission_classes=[IsPartner]
    def get(self,request,document_id):
        doc=partner_for(request).documents.filter(id=document_id).first()
        if not doc: raise Http404
        return FileResponse(doc.file.open("rb"),as_attachment=True,filename=doc.file.name.split("/")[-1])

class PartnerSubmitView(APIView):
    permission_classes=[IsPartner]
    def post(self,request):
        p=partner_for(request); p.status=PartnerProfile.Status.SUBMITTED; p.save(update_fields=["status","updated_at"])
        PartnerApproval.objects.create(partner=p,actor=request.user,action=PartnerApproval.Action.SUBMITTED)
        return Response({"reference":p.application_reference,"status":p.status})

class PartnerAvailabilityView(APIView):
    permission_classes=[IsPartner]
    def get(self,request):
        a, _=PartnerAvailability.objects.get_or_create(partner=partner_for(request)); return Response(PartnerAvailabilitySerializer(a).data)
    def patch(self,request):
        a,_=PartnerAvailability.objects.get_or_create(partner=partner_for(request)); s=PartnerAvailabilitySerializer(a,data=request.data,partial=True); s.is_valid(raise_exception=True); s.save(); return Response(s.data)

class PartnerBookingsView(APIView):
    permission_classes=[IsPartner]
    def get(self,request): return Response(PartnerBookingSerializer(partner_for(request).bookings.order_by("-scheduled_at"),many=True).data)

class PartnerBookingDetailView(APIView):
    permission_classes=[IsPartner]
    def get(self,request,pk):
        b=partner_for(request).bookings.filter(pk=pk).first()
        if not b:return Response({"detail":"Not found"},status=404)
        return Response(PartnerBookingSerializer(b).data)
    def post(self,request,pk):
        b=partner_for(request).bookings.filter(pk=pk).first()
        if not b:return Response({"detail":"Not found"},status=404)
        action=request.data.get("action")
        transitions={
            "accept":({"OFFERED"},"ACCEPTED"),
            "decline":({"OFFERED"},"CANCELLED"),
            "en_route":({"ACCEPTED"},"EN_ROUTE"),
            "arrived":({"EN_ROUTE"},"ARRIVED"),
            "start":({"ARRIVED"},"IN_PROGRESS"),
            "complete":({"IN_PROGRESS"},"COMPLETED"),
            "issue":({"ACCEPTED","EN_ROUTE","ARRIVED","IN_PROGRESS"},"ISSUE"),
            "unavailable":({"ARRIVED"},"CUSTOMER_UNAVAILABLE"),
        }
        transition=transitions.get(action)
        if not transition:return Response({"detail":"Invalid action"},status=400)
        allowed, new=transition
        if b.status not in allowed:return Response({"detail":f"Cannot perform {action} while booking is {b.status}."},status=400)
        if action=="decline" and not (request.data.get("reason") or "").strip():return Response({"detail":"A reason is required when declining a booking."},status=400)
        b.status=new
        if new=="IN_PROGRESS": b.started_at=timezone.now()
        if new=="COMPLETED": b.completed_at=timezone.now()
        b.save()
        return Response(PartnerBookingSerializer(b).data)

class PartnerEarningsView(APIView):
    permission_classes=[IsPartner]
    def get(self,request):
        qs=partner_for(request).bookings.filter(status="COMPLETED")
        gross=sum((b.amount for b in qs),0)
        commission=gross*0.15
        return Response({"gross":gross,"commission":commission,"deductions":0,"net":gross-commission})

class PartnerPayoutsView(APIView):
    permission_classes=[IsPartner]
    def get(self,request): return Response(PartnerPayoutSerializer(partner_for(request).payouts.order_by("-created_at"),many=True).data)

class PartnerSupportView(APIView):
    permission_classes=[IsPartner]
    def get(self,request): return Response(PartnerSupportTicketSerializer(partner_for(request).support_tickets.order_by("-created_at"),many=True).data)
    def post(self,request):
        s=PartnerSupportTicketSerializer(data=request.data); s.is_valid(raise_exception=True); s.save(partner=partner_for(request)); return Response(s.data,status=201)

class AdminPartnerListView(APIView):
    permission_classes=[IsAdminOrOwner]
    def get(self,request):
        qs=PartnerProfile.objects.select_related("user").order_by("-created_at")
        return Response(PartnerProfileSerializer(qs,many=True).data)

class AdminPartnerActionView(APIView):
    permission_classes=[IsAdminOrOwner]
    def post(self,request,partner_id):
        p=PartnerProfile.objects.filter(id=partner_id).first()
        if not p:return Response({"detail":"Not found"},status=404)
        action=request.data.get("action"); mapping={"approve":"APPROVED","reject":"REJECTED","request-info":"MORE_INFO","suspend":"SUSPENDED"}
        new=mapping.get(action)
        if not new:return Response({"detail":"Invalid action"},status=400)
        p.status=new;p.review_reason=request.data.get("reason","");p.save(update_fields=["status","review_reason","updated_at"])
        PartnerApproval.objects.create(partner=p,actor=request.user,action=new,reason=p.review_reason)
        return Response(PartnerProfileSerializer(p).data)
