<?php

declare(strict_types=1);

namespace App\Enums;

enum PermissionsEnum: string
{
    // Administrator
    case ManageUsers = 'manage_users';
    case ManagePermissions = 'manage_permissions';

    // Super User
    case ViewListCompanies = 'view_list_companies';
    case ViewCompanyInfo = 'view_company_info';
    case ViewListRecruiters = 'view_list_recruiters';
    case ViewListCandidates = 'view_list_candidates';
    case ViewCandidateProfile = 'view_candidate_profile';
    case DownloadCvCandidate = 'download_cv_candidate';
    case ViewReports = 'view_reports';
    case DownloadReports = 'download_reports';

    // Employer/Recruiter
    case UpdateCompanyInfo = 'update_company_info';
    case AssignRecruiter = 'assign_recruiter';
    case RegisterOffer = 'register_offer';
    case UpdateOffer = 'update_offer';
    case DeleteOffer = 'delete_offer';
    case ViewListOffers = 'view_list_offers';
    case ViewOffer = 'view_offer';
    case AddCandidateToOffer = 'add_candidate_to_offer';
    case ViewApplications = 'view_applications';
    case ChangeStatusApplication = 'change_status_application';
    case AddFollowUp = 'add_follow-up';
    case ViewIndicators = 'view_indicators';

    // Recrutier
    case ViewCompaniesWorking = 'view_companies_working';
    case ViewCompanyOffers = 'view_company_offers';

    // Candidate
    case UpdateProfile = 'update_profile';
    case SearchOffers = 'search_offers';
    case ApplyOffer = 'apply_offer';
    case ViewCandidateApplications = 'view_candidate_applications';
    case ViewApplicationStatus = 'view_application_status';
}
