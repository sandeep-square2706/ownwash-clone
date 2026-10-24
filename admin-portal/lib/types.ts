export type ListResponse<T> = T[] | { results: T[]; count?: number; next?: string | null; previous?: string | null };

export type Dashboard = {
  total_bookings: number;
  total_revenue: number;
  active_customers: number;
  active_partners: number;
  booking_trend?: { date: string; bookings: number; revenue: number }[];
  status_counts?: Record<string, number>;
};

export type Booking = {
  id: string | number;
  customer_name?: string;
  customer?: { id: number; name?: string; email?: string; phone?: string };
  service_name?: string;
  service?: { id: number; name?: string };
  scheduled_at?: string;
  date?: string;
  time?: string;
  status: string;
  total_amount?: number;
  amount?: number;
  partner_name?: string;
  partner?: { id: number; name?: string };
};

export type Customer = {
  id: number;
  name?: string;
  email: string;
  phone?: string;
  booking_count?: number;
  total_spend?: number;
  is_active?: boolean;
  date_joined?: string;
};

export type Partner = {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  location?: string;
  status?: string;
  total_jobs?: number;
  rating?: number | null;
};

export type Service = {
  id: number;
  name: string;
  slug?: string;
  category?: string;
  base_price?: number;
  min_price?: number;
  max_price?: number;
  duration?: number;
  is_active?: boolean;
  image?: string | null;
};

export type Offer = {
  id: number;
  name: string;
  type: string;
  value: number;
  valid_from?: string;
  valid_to?: string;
  is_active?: boolean;
};

export type Banner = {
  id: number;
  title: string;
  image?: string | null;
  placement?: string;
  is_active?: boolean;
};

export type Notification = {
  id: number;
  title: string;
  message?: string;
  audience?: string;
  created_at?: string;
  status?: string;
};

export type Payment = {
  id: number;
  booking_id?: string | number;
  amount?: number;
  status?: string;
  method?: string;
  created_at?: string;
};

export type Review = {
  id: number;
  customer_name?: string;
  service_name?: string;
  rating?: number;
  comment?: string;
  status?: string;
  created_at?: string;
};

export type Complaint = {
  id: number;
  customer_name?: string;
  booking_id?: string | number;
  subject?: string;
  status?: string;
  created_at?: string;
};
