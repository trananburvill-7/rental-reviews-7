// ============================================================
// Core Domain Types
// ============================================================

export type PropertyType =
  | 'house'
  | 'unit'
  | 'apartment'
  | 'townhouse'
  | 'duplex'
  | 'studio'
  | 'other'

export type ModerationStatus = 'pending' | 'approved' | 'rejected'

export type RentalDuration =
  | 'less_than_6_months'
  | '6_12_months'
  | '1_2_years'
  | '2_plus_years'

export type AustralianState =
  | 'NSW'
  | 'VIC'
  | 'QLD'
  | 'WA'
  | 'SA'
  | 'TAS'
  | 'ACT'
  | 'NT'

export type ReportReason = 'false_information' | 'abuse' | 'spam' | 'defamation'

// ============================================================
// Database Row Types
// ============================================================

export interface Property {
  id: string
  address: string
  suburb: string
  state: AustralianState
  postcode: string
  property_type: PropertyType
  bedrooms: number | null
  bathrooms: number | null
  car_spaces: number | null
  land_size: number | null
  description: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface PropertyImage {
  id: string
  property_id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  created_at: string
}

export interface PropertyManager {
  id: string
  name: string
  agency: string | null
  photo_url: string | null
  office_location: string | null
  email: string | null
  phone: string | null
  slug: string
  created_at: string
  updated_at: string
}

export interface PropertyReview {
  id: string
  property_id: string
  property_manager_id: string | null
  nickname: string | null
  property_condition: number
  manager_support: number
  maintenance_response: number
  bond_return: number
  overall_rating: number
  pros: string | null
  cons: string | null
  comments: string | null
  rent_again: boolean | null
  rental_duration: RentalDuration | null
  ip_hash: string | null
  moderation_status: ModerationStatus
  moderation_notes: string | null
  created_at: string
}

export interface ManagerReview {
  id: string
  property_manager_id: string
  property_id: string | null
  nickname: string | null
  communication: number
  professionalism: number
  maintenance_followup: number
  fairness: number
  bond_handling: number
  overall_rating: number
  comments: string | null
  ip_hash: string | null
  moderation_status: ModerationStatus
  moderation_notes: string | null
  created_at: string
}

export interface ReviewReport {
  id: string
  review_id: string
  review_type: 'property' | 'manager'
  reason: ReportReason
  notes: string | null
  reporter_ip_hash: string | null
  status: 'pending' | 'reviewed' | 'actioned'
  created_at: string
}

// ============================================================
// Enriched / Joined Types
// ============================================================

export interface PropertyWithStats extends Property {
  images: PropertyImage[]
  review_count: number
  avg_overall: number | null
  avg_property_condition: number | null
  avg_manager_support: number | null
  avg_maintenance_response: number | null
  avg_bond_return: number | null
}

export interface PropertyManagerWithStats extends PropertyManager {
  review_count: number
  avg_overall: number | null
  avg_communication: number | null
  avg_professionalism: number | null
  avg_maintenance_followup: number | null
  avg_fairness: number | null
  avg_bond_handling: number | null
  managed_property_count: number
}

export interface PropertyReviewWithDetails extends PropertyReview {
  property?: Partial<Property>
  manager?: Partial<PropertyManager>
}

export interface SuburbStats {
  suburb: string
  state: AustralianState
  postcode: string
  slug: string
  property_count: number
  review_count: number
  avg_overall: number | null
  top_managers: PropertyManagerWithStats[]
  recent_reviews: PropertyReview[]
}

// ============================================================
// Form Input Types
// ============================================================

export interface PropertyReviewFormData {
  nickname?: string
  property_condition: number
  manager_support: number
  maintenance_response: number
  bond_return: number
  pros?: string
  cons?: string
  comments?: string
  rent_again?: boolean
  rental_duration?: RentalDuration
  property_manager_id?: string
  turnstile_token?: string
}

export interface ManagerReviewFormData {
  nickname?: string
  communication: number
  professionalism: number
  maintenance_followup: number
  fairness: number
  bond_handling: number
  comments?: string
  property_id?: string
  turnstile_token?: string
}

export interface PropertyFormData {
  address: string
  suburb: string
  state: AustralianState
  postcode: string
  property_type: PropertyType
  bedrooms?: number
  bathrooms?: number
  car_spaces?: number
  land_size?: number
  description?: string
}

export interface ManagerFormData {
  name: string
  agency?: string
  photo_url?: string
  office_location?: string
  email?: string
  phone?: string
}

// ============================================================
// API Response Types
// ============================================================

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  page: number
  pageSize: number
  totalPages: number
}

export interface ApiError {
  error: string
  code?: string
  details?: unknown
}

export interface SearchResult {
  type: 'property' | 'manager' | 'suburb'
  id: string
  title: string
  subtitle: string
  slug: string
  rating?: number
  review_count?: number
}

// ============================================================
// Filter / Query Types
// ============================================================

export interface PropertySearchParams {
  query?: string
  suburb?: string
  state?: AustralianState
  postcode?: string
  property_type?: PropertyType
  min_rating?: number
  max_rating?: number
  sort?: 'highest_rated' | 'most_reviewed' | 'newest_review' | 'lowest_rated'
  page?: number
  page_size?: number
}

export interface ManagerSearchParams {
  query?: string
  agency?: string
  suburb?: string
  min_rating?: number
  sort?: 'highest_rated' | 'most_reviewed' | 'lowest_rated'
  page?: number
  page_size?: number
}

// ============================================================
// Admin Types
// ============================================================

export interface AdminStats {
  total_properties: number
  total_managers: number
  total_property_reviews: number
  total_manager_reviews: number
  pending_reviews: number
  approved_reviews: number
  rejected_reviews: number
  pending_reports: number
  reviews_this_week: number
  avg_overall_rating: number
}

export interface ModerationQueueItem {
  id: string
  type: 'property' | 'manager'
  property?: Partial<Property>
  manager?: Partial<PropertyManager>
  reviewer_nickname: string | null
  overall_rating: number
  content_preview: string
  ip_hash: string | null
  created_at: string
  report_count: number
}

// ============================================================
// Rating Display Helpers
// ============================================================

export interface RatingBreakdown {
  label: string
  key: string
  value: number | null
  count: number
}

export const RENTAL_DURATION_LABELS: Record<RentalDuration, string> = {
  less_than_6_months: 'Less than 6 months',
  '6_12_months': '6–12 months',
  '1_2_years': '1–2 years',
  '2_plus_years': '2+ years',
}

export const PROPERTY_TYPE_LABELS: Record<PropertyType, string> = {
  house: 'House',
  unit: 'Unit',
  apartment: 'Apartment',
  townhouse: 'Townhouse',
  duplex: 'Duplex',
  studio: 'Studio',
  other: 'Other',
}

export const AUSTRALIAN_STATES: AustralianState[] = [
  'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'
]
