import { supabase } from '../lib/supabase';
import { RentalDocument, RentalDocumentType } from '../types';

export const getUserRentalDocuments = async (userId?: string): Promise<RentalDocument[]> => {
  return [
    {
      id: 'doc_agree_001',
      title: 'Registered Registered Lease Agreement — Bandra West',
      doc_type: 'agreement',
      file_url: 'https://docs.rehvo.com/sample_lease.pdf',
      size_bytes: 2450000,
      date_created: new Date(Date.now() - 86400000 * 45).toISOString(),
      is_verified: true,
      download_count: 3,
    },
    {
      id: 'doc_rec_002',
      title: 'HRA Rent Receipt — August 2026',
      doc_type: 'receipt',
      file_url: 'https://docs.rehvo.com/receipt_aug.pdf',
      size_bytes: 380000,
      date_created: new Date(Date.now() - 86400000 * 10).toISOString(),
      is_verified: true,
      download_count: 1,
    },
    {
      id: 'doc_noc_003',
      title: 'Society NOC & Move-in Clearance Certificate',
      doc_type: 'noc',
      file_url: 'https://docs.rehvo.com/society_noc.pdf',
      size_bytes: 720000,
      date_created: new Date(Date.now() - 86400000 * 44).toISOString(),
      is_verified: true,
      download_count: 2,
    },
    {
      id: 'doc_police_004',
      title: 'Mumbai Police Tenant Intimation Acknowledgment',
      doc_type: 'police_verification',
      file_url: 'https://docs.rehvo.com/police_intimation.pdf',
      size_bytes: 510000,
      date_created: new Date(Date.now() - 86400000 * 42).toISOString(),
      is_verified: true,
      download_count: 1,
    },
    {
      id: 'doc_tax_005',
      title: 'Annual HRA Tax Declaration Package (Form 16/12BB)',
      doc_type: 'tax_certificate',
      file_url: 'https://docs.rehvo.com/hra_tax_summary.pdf',
      size_bytes: 1200000,
      date_created: new Date(Date.now() - 86400000 * 90).toISOString(),
      is_verified: true,
      download_count: 4,
    },
  ];
};

export const filterRentalDocuments = (
  docs: RentalDocument[],
  typeFilter: string,
  query: string
): RentalDocument[] => {
  return docs.filter((doc) => {
    const matchesType = typeFilter === 'ALL' || doc.doc_type === typeFilter;
    const matchesQuery = !query.trim() || doc.title.toLowerCase().includes(query.toLowerCase());
    return matchesType && matchesQuery;
  });
};
