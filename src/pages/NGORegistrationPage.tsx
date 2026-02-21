import { useState } from 'react';
import { ArrowLeft, Building2, Mail, Phone, MapPin, FileText, Upload, CheckCircle, Users, Calendar, Lock, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

interface NGORegistrationPageProps {
  onNavigate: (page: string, params?: any) => void;
}

export function NGORegistrationPage({ onNavigate }: NGORegistrationPageProps) {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Basic Information
    ngoName: '',
    registrationNumber: '',
    foundedYear: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    
    // Location
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Organization Details
    cause: '',
    mission: '',
    vision: '',
    activities: [] as string[],
    
    // Leadership
    founderName: '',
    directorName: '',
    contactPerson: '',
    contactPersonEmail: '',
    contactPersonPhone: '',
    
    // Compliance
    panNumber: '',
    gstNumber: '',
    fcraRegistered: '',
    section80G: '',
    
    // Operations
    annualBudget: '',
    teamSize: '',
    volunteersCount: '',
    beneficiariesReached: '',
    
    // Additional
    achievements: '',
    requirements: '',
  });

  const [submitted, setSubmitted] = useState(false);

  const causes = ['Education', 'Healthcare', 'Environment', 'Women Empowerment', 'Child Welfare', 'Rural Development', 'Animal Welfare', 'Disaster Relief'];
  const activityOptions = ['Awareness Campaigns', 'Direct Services', 'Research & Advocacy', 'Skill Training', 'Community Development', 'Emergency Relief', 'Counseling', 'Infrastructure Building'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMultiSelect = (field: 'activities', value: string) => {
    setFormData(prev => {
      const current = prev[field];
      if (current.includes(value)) {
        return { ...prev, [field]: current.filter(item => item !== value) };
      } else {
        return { ...prev, [field]: [...current, value] };
      }
    });
  };

  const handleSubmit = () => {
    // Save to localStorage
    const ngos = JSON.parse(localStorage.getItem('ngos') || '[]');
    const newNGO = {
      id: Date.now().toString(),
      ...formData,
      registeredDate: new Date().toISOString(),
      status: 'pending-verification',
      verified: false,
    };
    ngos.push(newNGO);
    localStorage.setItem('ngos', JSON.stringify(ngos));
    localStorage.setItem('currentNGO', JSON.stringify(newNGO));
    
    setSubmitted(true);
  };

  const nextStep = () => {
    if (step < 5) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-6 sm:py-8 md:py-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-xl">
            <CardContent className="p-6 sm:p-8 md:p-12 text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <CheckCircle className="w-9 h-9 sm:w-12 sm:h-12 text-white" />
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4">
                Welcome to ImpactHub, {formData.ngoName}!
              </h2>
              <p className="text-base sm:text-lg text-gray-600 mb-3 sm:mb-4">
                Your NGO registration has been submitted successfully. Our team will verify your details and activate your profile within 48 hours.
              </p>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 sm:mb-8">
                <p className="text-sm text-blue-800">
                  <strong>Next Steps:</strong> You will receive a confirmation email at {formData.email} once your account is verified.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90"
                  onClick={() => onNavigate('ngo-admin')}
                >
                  Go to Admin Panel
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => onNavigate('landing')}
                >
                  Back to Home
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8 md:py-12">
      <div className="max-w-4xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <Button
            variant="ghost"
            onClick={() => onNavigate('landing')}
            className="gap-2 mb-3 sm:mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4" />
            Back to Home
          </Button>
          <div className="text-center">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Building2 className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">
              NGO Registration
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-gray-600 px-2">
              Join 247+ verified NGOs on ImpactHub and expand your reach
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-4 sm:mb-6 md:mb-8">
          <div className="flex items-center justify-center overflow-x-auto pb-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <div key={num} className="flex items-center flex-shrink-0">
                <div className={`w-7 h-7 sm:w-8 sm:h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-xs sm:text-sm md:text-base font-semibold ${
                  step >= num ? 'bg-primary text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 5 && (
                  <div className={`w-6 sm:w-10 md:w-12 h-1 mx-1 sm:mx-2 ${step > num ? 'bg-primary' : 'bg-gray-200'}`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <p className="text-xs sm:text-sm text-gray-600 text-center px-2">
              {step === 1 && 'Basic Information'}
              {step === 2 && 'Location & Contact'}
              {step === 3 && 'Organization Details'}
              {step === 4 && 'Compliance & Documents'}
              {step === 5 && 'Operations & Impact'}
            </p>
          </div>
        </div>

        {/* Form */}
        <Card className="shadow-lg">
          <CardContent className="p-4 sm:p-6 md:p-8">
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    NGO/Organization Name *
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      value={formData.ngoName}
                      onChange={(e) => handleInputChange('ngoName', e.target.value)}
                      placeholder="Enter your organization name"
                      className="pl-10 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Registration Number *
                    </label>
                    <div className="relative">
                      <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.registrationNumber}
                        onChange={(e) => handleInputChange('registrationNumber', e.target.value)}
                        placeholder="Registration/Trust number"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Year Founded *
                    </label>
                    <div className="relative">
                      <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.foundedYear}
                        onChange={(e) => handleInputChange('foundedYear', e.target.value)}
                        placeholder="YYYY"
                        className="pl-10 bg-white"
                        maxLength={4}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Website (Optional)
                  </label>
                  <Input
                    type="url"
                    value={formData.website}
                    onChange={(e) => handleInputChange('website', e.target.value)}
                    placeholder="https://www.example.org"
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        placeholder="Enter a strong password"
                        className="pl-10 bg-white"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type={showConfirmPassword ? 'text' : 'password'}
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                        placeholder="Re-enter your password"
                        className="pl-10 bg-white"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Location & Contact */}
            {step === 2 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Location & Contact</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Registered Address *
                  </label>
                  <Input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    placeholder="Full address"
                    className="bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City *
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="text"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="City"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      State *
                    </label>
                    <Input
                      type="text"
                      value={formData.state}
                      onChange={(e) => handleInputChange('state', e.target.value)}
                      placeholder="State"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PIN Code *
                    </label>
                    <Input
                      type="text"
                      value={formData.pincode}
                      onChange={(e) => handleInputChange('pincode', e.target.value)}
                      placeholder="400001"
                      className="bg-white"
                      maxLength={6}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Official Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="contact@ngo.org"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Number *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+91 98765 43210"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="border-t pt-6 mt-6">
                  <h4 className="font-semibold text-gray-900 mb-4">Primary Contact Person</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Name *
                      </label>
                      <Input
                        type="text"
                        value={formData.contactPerson}
                        onChange={(e) => handleInputChange('contactPerson', e.target.value)}
                        placeholder="Full name"
                        className="bg-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Contact Person Email *
                      </label>
                      <Input
                        type="email"
                        value={formData.contactPersonEmail}
                        onChange={(e) => handleInputChange('contactPersonEmail', e.target.value)}
                        placeholder="person@ngo.org"
                        className="bg-white"
                      />
                    </div>
                  </div>

                  <div className="mt-6">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Contact Person Phone *
                    </label>
                    <Input
                      type="tel"
                      value={formData.contactPersonPhone}
                      onChange={(e) => handleInputChange('contactPersonPhone', e.target.value)}
                      placeholder="+91 98765 43210"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Organization Details */}
            {step === 3 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Organization Details</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Primary Cause *
                  </label>
                  <Select value={formData.cause} onValueChange={(value) => handleInputChange('cause', value)}>
                    <SelectTrigger className="bg-white">
                      <SelectValue placeholder="Select primary cause" />
                    </SelectTrigger>
                    <SelectContent>
                      {causes.map((cause) => (
                        <SelectItem key={cause} value={cause}>
                          {cause}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mission Statement *
                  </label>
                  <textarea
                    value={formData.mission}
                    onChange={(e) => handleInputChange('mission', e.target.value)}
                    placeholder="Describe your organization's mission..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Vision Statement *
                  </label>
                  <textarea
                    value={formData.vision}
                    onChange={(e) => handleInputChange('vision', e.target.value)}
                    placeholder="Describe your organization's vision..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Activities (Select all that apply) *
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
                    {activityOptions.map((activity) => (
                      <button
                        key={activity}
                        type="button"
                        onClick={() => handleMultiSelect('activities', activity)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.activities.includes(activity)
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {activity}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Founder Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.founderName}
                      onChange={(e) => handleInputChange('founderName', e.target.value)}
                      placeholder="Founder's full name"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Director/President Name *
                    </label>
                    <Input
                      type="text"
                      value={formData.directorName}
                      onChange={(e) => handleInputChange('directorName', e.target.value)}
                      placeholder="Director's full name"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Compliance & Documents */}
            {step === 4 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Compliance & Documents</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      PAN Number *
                    </label>
                    <Input
                      type="text"
                      value={formData.panNumber}
                      onChange={(e) => handleInputChange('panNumber', e.target.value)}
                      placeholder="ABCDE1234F"
                      className="bg-white uppercase"
                      maxLength={10}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      GST Number (Optional)
                    </label>
                    <Input
                      type="text"
                      value={formData.gstNumber}
                      onChange={(e) => handleInputChange('gstNumber', e.target.value)}
                      placeholder="22AAAAA0000A1Z5"
                      className="bg-white uppercase"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      FCRA Registered? *
                    </label>
                    <Select value={formData.fcraRegistered} onValueChange={(value) => handleInputChange('fcraRegistered', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      80G Certification? *
                    </label>
                    <Select value={formData.section80G} onValueChange={(value) => handleInputChange('section80G', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">Yes</SelectItem>
                        <SelectItem value="no">No</SelectItem>
                        <SelectItem value="applied">Applied</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">
                    <strong>Note:</strong> You will need to upload supporting documents (Registration Certificate, PAN Card, etc.) after account approval.
                  </p>
                </div>
              </div>
            )}

            {/* Step 5: Operations & Impact */}
            {step === 5 && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Operations & Impact</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Annual Budget Range *
                    </label>
                    <Select value={formData.annualBudget} onValueChange={(value) => handleInputChange('annualBudget', value)}>
                      <SelectTrigger className="bg-white">
                        <SelectValue placeholder="Select range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under-5L">Under ₹5 Lakh</SelectItem>
                        <SelectItem value="5L-20L">₹5 - 20 Lakh</SelectItem>
                        <SelectItem value="20L-50L">₹20 - 50 Lakh</SelectItem>
                        <SelectItem value="50L-1Cr">₹50 Lakh - 1 Crore</SelectItem>
                        <SelectItem value="above-1Cr">Above ₹1 Crore</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Team Size *
                    </label>
                    <div className="relative">
                      <Users className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <Input
                        type="number"
                        value={formData.teamSize}
                        onChange={(e) => handleInputChange('teamSize', e.target.value)}
                        placeholder="Number of staff members"
                        className="pl-10 bg-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Current Volunteers *
                    </label>
                    <Input
                      type="number"
                      value={formData.volunteersCount}
                      onChange={(e) => handleInputChange('volunteersCount', e.target.value)}
                      placeholder="Number of active volunteers"
                      className="bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Beneficiaries Reached *
                    </label>
                    <Input
                      type="number"
                      value={formData.beneficiariesReached}
                      onChange={(e) => handleInputChange('beneficiariesReached', e.target.value)}
                      placeholder="Total beneficiaries"
                      className="bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Key Achievements
                  </label>
                  <textarea
                    value={formData.achievements}
                    onChange={(e) => handleInputChange('achievements', e.target.value)}
                    placeholder="List your major achievements and impact stories..."
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Requirements
                  </label>
                  <textarea
                    value={formData.requirements}
                    onChange={(e) => handleInputChange('requirements', e.target.value)}
                    placeholder="What kind of support do you need? (volunteers, resources, etc.)"
                    className="w-full min-h-[100px] px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                  />
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={prevStep}
                >
                  Previous
                </Button>
              )}
              {step < 5 ? (
                <Button
                  className="ml-auto bg-primary hover:bg-primary/90"
                  onClick={nextStep}
                >
                  Next
                </Button>
              ) : (
                <Button
                  className="ml-auto bg-primary hover:bg-primary/90"
                  onClick={handleSubmit}
                >
                  Submit for Verification
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}