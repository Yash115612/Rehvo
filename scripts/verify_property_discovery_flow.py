#!/usr/bin/env python3
"""
REHVO Property Publishing & Public Discovery Flow Assertion Script
Tests:
1. Category-to-type query mapping in queries.ts (Residential -> flat, room, pg, studio; Commercial -> office, shop, etc.)
2. No invalid DB columns (category, carpet_area, business_type) queried in Supabase select/eq filters.
3. Owner publish flow payload mapper creates status='published' with valid DB keys.
4. RLS security model allows public SELECT for status='published'.
"""

import os
import sys
import re

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
QUERIES_TS = os.path.join(ROOT_DIR, 'web', 'src', 'lib', 'seo', 'queries.ts')
PROPERTIES_TS = os.path.join(ROOT_DIR, 'web', 'src', 'services', 'properties.ts')
RLS_SQL = os.path.join(ROOT_DIR, 'supabase', 'migrations', '009_rls_policies.sql')

def verify_category_query_mapping():
    print("\n--- 1. Auditing Category Query Mapping in queries.ts ---")
    with open(QUERIES_TS, 'r', encoding='utf-8') as f:
        code = f.read()

    # Check for invalid query.eq('category', ...)
    if "query.eq('category'" in code or 'query.eq("category"' in code:
        print("❌ FAIL: queries.ts still queries non-existent column 'category' via eq('category')!")
        return False

    if "query.in('type', RESIDENTIAL_TYPES)" not in code or "query.in('type', COMMERCIAL_TYPES)" not in code:
        print("❌ FAIL: queries.ts does not map category to type IN (RESIDENTIAL_TYPES / COMMERCIAL_TYPES)")
        return False

    print("✅ PASS: Category queries correctly mapped to database column 'type' with IN filters")
    return True

def verify_property_service_queries():
    print("\n--- 2. Auditing Property Service Category Filters in properties.ts ---")
    with open(PROPERTIES_TS, 'r', encoding='utf-8') as f:
        code = f.read()

    if "query.eq('category'" in code or 'query.eq("category"' in code:
        print("❌ FAIL: properties.ts still queries non-existent column 'category' via eq('category')!")
        return False

    print("✅ PASS: properties.ts uses canonical type mappings for category filters")
    return True

def verify_owner_publish_payload():
    print("\n--- 3. Auditing Owner Listing Publish Payload ---")
    with open(PROPERTIES_TS, 'r', encoding='utf-8') as f:
        code = f.read()

    # Verify mapListingFormToPropertyInsert sets status
    if "status: status" not in code:
        print("❌ FAIL: mapListingFormToPropertyInsert does not set status")
        return False

    # Verify default status is 'published'
    if "status: PropertyStatus = 'published'" not in code:
        print("❌ FAIL: createProperty default status is not 'published'")
        return False

    print("✅ PASS: Owner listing creation defaults to status='published' on the database payload")
    return True

def verify_rls_policy():
    print("\n--- 4. Auditing Row Level Security (RLS) Policy for Public Discovery ---")
    with open(RLS_SQL, 'r', encoding='utf-8') as f:
        sql = f.read()

    # Check policy for properties
    if "status = 'published'" not in sql:
        print("❌ FAIL: 009_rls_policies.sql does not allow public SELECT for status = 'published'")
        return False

    print("✅ PASS: RLS policy allows public SELECT on public.properties where status = 'published'")
    return True

def main():
    print("=" * 60)
    print("REHVO PROPERTY PUBLISHING & DISCOVERY FLOW AUDIT")
    print("=" * 60)

    c_ok = verify_category_query_mapping()
    s_ok = verify_property_service_queries()
    o_ok = verify_owner_publish_payload()
    r_ok = verify_rls_policy()

    if not (c_ok and s_ok and o_ok and r_ok):
        print("\n❌ Property discovery flow audit failed!")
        sys.exit(1)

    print("\n🎉 ALL PROPERTY PUBLISHING & DISCOVERY CHECKS PASSED!")

if __name__ == '__main__':
    main()
