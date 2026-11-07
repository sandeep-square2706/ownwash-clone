"use client";

import { useEffect, useState } from "react";
import DashboardShell from "../../../components/partner/DashboardShell";
import { Panel, PrimaryButton, SelectField, TextField } from "../../../components/partner/PartnerUI";
import { partnerApi, partnerMediaUrl } from "../../../lib/partner/api";

type Profile = {
  legal_name: string;
  display_name: string;
  business_name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
  experience: string;
  team_size: number;
  max_travel_km: string;
  languages: string;
  service_areas: string;
  emergency_contact: string;
  profile_photo?: string | null;
};

type ApiProfile = Omit<Profile, "languages" | "service_areas"> & {
  languages: string[];
  service_areas: string[];
};

const blank: Profile = {
  legal_name: "",
  display_name: "",
  business_name: "",
  phone: "",
  email: "",
  address: "",
  city: "",
  district: "",
  state: "",
  pincode: "",
  experience: "",
  team_size: 1,
  max_travel_km: "10",
  languages: "",
  service_areas: "",
  emergency_contact: "",
  profile_photo: null,
};

function fromApi(profile: ApiProfile): Profile {
  return {
    ...blank,
    ...profile,
    languages: (profile.languages || []).join(", "),
    service_areas: (profile.service_areas || []).join(", "),
  };
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile>(blank);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    let active = true;
    partnerApi<ApiProfile>("/partners/me/")
      .then((data) => {
        if (active) setProfile(fromApi(data));
      })
      .catch((cause: unknown) => {
        if (active) {
          setError(cause instanceof Error ? cause.message : "Could not load profile.");
        }
      });
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!photoFile) {
      setPhotoPreview(partnerMediaUrl(profile.profile_photo));
      return;
    }

    const previewUrl = URL.createObjectURL(photoFile);
    setPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [photoFile, profile.profile_photo]);

  function set<K extends keyof Profile>(key: K, value: Profile[K]) {
    setProfile((current) => ({ ...current, [key]: value }));
  }

  function choosePhoto(file?: File) {
    setError("");
    setMessage("");
    if (!file) {
      setPhotoFile(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setError("Choose an image file for your profile photo.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Profile photos must be 5 MB or smaller.");
      return;
    }
    setPhotoFile(file);
  }

  async function save() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const { profile_photo: _profilePhoto, ...profileFields } = profile;
      const updated = await partnerApi<ApiProfile>("/partners/me/", {
        method: "PATCH",
        body: JSON.stringify({
          ...profileFields,
          languages: profile.languages.split(",").map((value) => value.trim()).filter(Boolean),
          service_areas: profile.service_areas.split(",").map((value) => value.trim()).filter(Boolean),
        }),
      });
      setProfile(fromApi(updated));
      window.dispatchEvent(new Event("partner-profile-updated"));

      if (photoFile) {
        const formData = new FormData();
        formData.append("profile_photo", photoFile);
        const photoUpdated = await partnerApi<ApiProfile>("/partners/me/", {
          method: "PATCH",
          body: formData,
        });
        setProfile(fromApi(photoUpdated));
        setPhotoFile(null);
        window.dispatchEvent(new Event("partner-profile-updated"));
      }

      setMessage("Profile updated successfully.");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not update profile.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <DashboardShell>
      <div className="cp-page-heading">
        <div>
          <h1>My profile</h1>
          <p>Keep your contact and business location details current.</p>
        </div>
      </div>
      {error ? <div className="cp-alert cp-alert-error" role="alert">{error}</div> : null}
      {message ? (
        <div className="cp-alert" role="status" style={{ background: "#eaf8ef", borderColor: "#c9ebd5", color: "#17683b" }}>
          {message}
        </div>
      ) : null}

      <Panel title="Profile photo" subtitle="Add a photo so your partner account is easy to recognize.">
        <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
          <div
            style={{
              width: 112,
              height: 112,
              display: "grid",
              placeItems: "center",
              overflow: "hidden",
              borderRadius: "50%",
              background: "#e9f3ff",
              color: "#1472e8",
              fontSize: 36,
              fontWeight: 800,
            }}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Your partner profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              (profile.display_name || profile.legal_name || "P").slice(0, 1).toUpperCase()
            )}
          </div>
          <label className="cp-field" style={{ flex: "1 1 260px" }}>
            <span>Upload your photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => choosePhoto(event.target.files?.[0])}
              disabled={busy}
            />
            <small style={{ display: "block", marginTop: 7, color: "#65758e" }}>
              Use a clear photo of yourself. Maximum file size: 5 MB.
            </small>
          </label>
        </div>
      </Panel>

      <Panel title="Partner information" subtitle="Your application status and reference are managed by Zaapino administrators.">
        <div className="cp-form-grid">
          <TextField label="Legal name" value={profile.legal_name || ""} onChange={(value) => set("legal_name", value)} />
          <TextField label="Display name" value={profile.display_name || ""} onChange={(value) => set("display_name", value)} />
          <TextField label="Business name" value={profile.business_name || ""} onChange={(value) => set("business_name", value)} />
          <TextField label="Mobile number" value={profile.phone || ""} onChange={(value) => set("phone", value)} />
          <TextField label="Email address" value={profile.email || ""} onChange={(value) => set("email", value)} type="email" />
          <TextField label="Emergency contact" value={profile.emergency_contact || ""} onChange={(value) => set("emergency_contact", value)} />
          <TextField label="Address" value={profile.address || ""} onChange={(value) => set("address", value)} />
          <TextField label="City" value={profile.city || ""} onChange={(value) => set("city", value)} />
          <TextField label="District" value={profile.district || ""} onChange={(value) => set("district", value)} />
          <TextField label="State" value={profile.state || ""} onChange={(value) => set("state", value)} />
          <TextField label="PIN code" value={profile.pincode || ""} onChange={(value) => set("pincode", value)} />
          <SelectField
            label="Experience"
            value={profile.experience || ""}
            onChange={(value) => set("experience", value)}
            options={["Less than 1 year", "1–3 years", "3–5 years", "5+ years"]}
          />
          <TextField label="Team size" type="number" value={profile.team_size || 1} onChange={(value) => set("team_size", Math.max(1, Number(value) || 1))} />
          <TextField label="Maximum travel distance (km)" type="number" value={profile.max_travel_km || "10"} onChange={(value) => set("max_travel_km", value)} />
          <TextField label="Languages (comma separated)" value={profile.languages || ""} onChange={(value) => set("languages", value)} />
          <TextField label="Service areas / PIN codes (comma separated)" value={profile.service_areas || ""} onChange={(value) => set("service_areas", value)} />
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 18 }}>
          <PrimaryButton onClick={save} disabled={busy}>
            {busy ? "Saving…" : "Save profile"}
          </PrimaryButton>
        </div>
      </Panel>
    </DashboardShell>
  );
}
