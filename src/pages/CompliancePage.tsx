import { Shield, FileCheck, Lock, AlertCircle, CheckCircle2, BookOpen } from 'lucide-react';

export function CompliancePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary via-blue-600 to-secondary py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-xl mb-6">
            <Shield className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-5xl font-bold text-white mb-6">Compliance Guidelines</h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Ensuring transparency, accountability, and legal compliance for all NGOs on ImpactHub
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Overview */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Compliance Overview</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-4">
            At ImpactHub, we maintain the highest standards of compliance to ensure trust, transparency, and legal adherence. All registered NGOs must meet required legal and operational standards to operate on our platform.
          </p>
          <p className="text-lg text-gray-700 leading-relaxed">
            This page outlines the essential compliance requirements and best practices for NGOs registered with ImpactHub.
          </p>
        </div>

        {/* Key Compliance Requirements */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <FileCheck className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Key Compliance Requirements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-primary">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Registration & Legal Status</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Maintain valid Trust/Society/Section 8 registration status</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Maintain 12A and 80G compliance where applicable</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Maintain FCRA compliance where applicable</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-secondary">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Tax & Financial Compliance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Ensure PAN and tax identity details are valid and up to date</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Complete regular financial audits as required</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>File income tax returns on time</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-accent">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Governance Compliance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Follow your approved governance framework and bylaws</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Conduct governance and decision-making as per policy</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Maintain verified and accountable board/leadership records</span>
                </li>
              </ul>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
              <h3 className="text-xl font-bold text-gray-900 mb-3">Operational Compliance</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Review and track annual organizational performance</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Track project implementation quality and outcomes</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-5 h-5 text-secondary mt-0.5 flex-shrink-0" />
                  <span>Measure and report impact through clear compliance practices</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Legal Compliance */}
        <div className="bg-gradient-to-br from-blue-50 to-green-50 rounded-2xl p-8 md:p-12 mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Legal Compliance Requirements</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Regulatory Adherence</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Compliance with Income Tax Act provisions for charitable organizations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Adherence to Foreign Contribution Regulation Act (FCRA), where applicable</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Compliance with state-specific NGO regulations</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>
                  <span>Regular filing of returns and reports with authorities</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Operational Standards</h3>
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Maintain proper books of accounts and financial records</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Conduct regular board meetings as per bylaws</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Annual financial audits by certified auditors</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-secondary rounded-full mt-2"></div>
                  <span>Transparent reporting of resource utilization</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-gradient-to-br from-secondary to-green-600 rounded-xl flex items-center justify-center">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Best Practices</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Data Protection</h3>
              <p className="text-gray-600">
                Ensure volunteer and beneficiary data is protected with appropriate security measures and privacy policies.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Conflict of Interest</h3>
              <p className="text-gray-600">
                Maintain policies to identify and manage conflicts of interest among board members and staff.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Financial Transparency</h3>
              <p className="text-gray-600">
                Publish annual reports and financial statements for public access and stakeholder review.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Ethical Outreach</h3>
              <p className="text-gray-600">
                Follow ethical guidelines in all outreach activities with clear communication about program usage.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Regular Audits</h3>
              <p className="text-gray-600">
                Conduct both internal and external audits regularly to ensure financial accountability.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-md p-6">
              <h3 className="font-bold text-gray-900 mb-3">Impact Reporting</h3>
              <p className="text-gray-600">
                Document and report the social impact of your programs with measurable outcomes.
              </p>
            </div>
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border-l-4 border-accent rounded-xl p-6">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-gray-900 mb-2">Important Notice</h3>
              <p className="text-gray-700 mb-2">
                NGOs must stay compliant with all applicable regulations and renew certifications before expiry. Failure to maintain compliance may result in suspension or removal from the ImpactHub platform.
              </p>
              <p className="text-gray-700">
                For any questions regarding compliance requirements, please contact our support team at compliance@impacthub.org
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
