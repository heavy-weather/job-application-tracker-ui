import Company from './Company';
import Resume from "./Resume";

export default interface JobApplication {
    id?: string;
    jobTitle: string;
    jobDescription: string;
    resume: Resume;
    status: string;
    jobPostingUrl: string;
    companyId?: string;
    company?: Company;
    sentDate: string;
    notes: string;
}
