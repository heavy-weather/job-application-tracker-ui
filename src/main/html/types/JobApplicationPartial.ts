import Company from './Company';

export default interface JobApplicationPartial {
    id: string;
    jobTitle: string;
    status: string;
    jobPostingUrl: string;
    company: Company;
    sentDate: string;
}
