/**
 * REHVO V7 Identity Verification (KYC) Data Types & Models
 */

export type KycStep =
  | "home"
  | "aadhaar_number"
  | "aadhaar_otp"
  | "aadhaar_docs"
  | "selfie"
  | "pan_doc"
  | "review"
  | "processing"
  | "success"
  | "failed";

export type KycStatus =
  | "not_started"
  | "in_progress"
  | "pending_review"
  | "verified"
  | "rejected";

export type KycFailureReason =
  | "aadhaar_otp_failed"
  | "aadhaar_image_unclear"
  | "selfie_not_matched"
  | "pan_image_unclear"
  | "verification_rejected"
  | "network_error";

export interface OcrAadhaarData {
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  address: string;
  maskedAadhaar: string;
}

export interface OcrPanData {
  holderName: string;
  panNumber: string;
  dob: string;
  fatherName?: string;
}

export interface LivenessCheckStatus {
  alignmentPassed: boolean;
  blinkPassed: boolean;
  headTurnPassed: boolean;
  smilePassed: boolean;
  photoUri: string | null;
}

export interface KycSessionData {
  userId: string;
  currentStep: KycStep;
  status: KycStatus;
  progressPercent: number;

  // Step 2 & 3: Aadhaar OTP
  rawAadhaarNumber?: string;
  maskedAadhaar?: string;
  aadhaarOtpTxnId?: string;
  aadhaarOtpVerified?: boolean;

  // Step 4: Aadhaar Docs
  aadhaarFrontUri?: string | null;
  aadhaarBackUri?: string | null;
  aadhaarOcrData?: OcrAadhaarData;

  // Step 5: Selfie
  selfieUri?: string | null;
  livenessStatus?: LivenessCheckStatus;

  // Step 6: PAN Doc
  panCardUri?: string | null;
  panOcrData?: OcrPanData;

  // Trust score & metrics
  trustScore?: number;
  digilockerVerified?: boolean;
  livenessScore?: number;
  matchScore?: number;

  // Timestamps & Cert
  verificationId?: string;
  verificationTimestamp?: string;
  reviewTimestamp?: string;
  failureReason?: KycFailureReason;
  failureMessage?: string;
}
