import ResumeCreatePayload from "./ResumeCreatePayload";

export default interface JobApplicationCreatePayload {
    jobTitle: string;
    jobDescription: string;
    resume: ResumeCreatePayload;
    status: string;
    jobPostingUrl: string;
    companyId: string;
    sentDate: string;
    notes: string;
}