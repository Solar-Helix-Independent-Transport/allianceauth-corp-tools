// The backend's OpenAPI schema for these mail endpoints is under-specified
// (loose `unknown[]`/object), so these shapes are derived from how Mail.tsx
// and MailModal actually consume them.
export interface MailListItem {
  character: string;
  character_id: number;
  mail_id: number;
  from: string;
  labels: string[];
  recipients: string[];
  timestamp: string;
  subject: string;
}

export interface MailBody {
  body: string;
}
