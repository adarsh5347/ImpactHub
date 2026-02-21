// Mock data for ImpactHub platform

export interface NGO {
  id: string;
  name: string;
  mission: string;
  vision: string;
  verified: boolean;
  cause: string;
  location: string;
  activeProjects: number;
  completedProjects: number;
  totalFundsRaised: number;
  logo: string;
  coverImage: string;
  yearFounded: number;
  registrationNumber: string;
}

export interface Project {
  id: string;
  ngoId: string;
  ngoName: string;
  title: string;
  description: string;
  cause: string;
  location: string;
  status: 'ongoing' | 'completed' | 'funded';
  fundingGoal: number;
  fundsRaised: number;
  startDate: string;
  endDate: string;
  beneficiaries: number;
  image: string;
  requiredResources: string[];
  volunteersNeeded: number;
  volunteersEnrolled: number;
}

export interface Donation {
  id: string;
  donorId: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  amount: number;
  date: string;
  receiptNumber: string;
  status: 'completed' | 'pending';
}

export interface VolunteerOpportunity {
  id: string;
  projectId: string;
  projectName: string;
  ngoName: string;
  title: string;
  description: string;
  skills: string[];
  location: string;
  duration: string;
  commitment: string;
  spotsAvailable: number;
}

export const mockNGOs: NGO[] = [
  {
    id: '1',
    name: 'Education for All Foundation',
    mission: 'Empowering underprivileged children through quality education and skill development programs.',
    vision: 'A world where every child has access to quality education regardless of their socio-economic background.',
    verified: true,
    cause: 'Education',
    location: 'Mumbai, India',
    activeProjects: 8,
    completedProjects: 24,
    totalFundsRaised: 2500000,
    logo: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&h=400&fit=crop',
    yearFounded: 2015,
    registrationNumber: 'NGO-2015-MH-001234',
  },
  {
    id: '2',
    name: 'Green Earth Initiative',
    mission: 'Protecting the environment through sustainable practices and community-driven conservation efforts.',
    vision: 'Creating a sustainable future where communities live in harmony with nature.',
    verified: true,
    cause: 'Environment',
    location: 'Bangalore, India',
    activeProjects: 12,
    completedProjects: 35,
    totalFundsRaised: 3800000,
    logo: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=800&h=400&fit=crop',
    yearFounded: 2012,
    registrationNumber: 'NGO-2012-KA-005678',
  },
  {
    id: '3',
    name: 'Health First Community',
    mission: 'Providing accessible healthcare and wellness programs to underserved communities.',
    vision: 'Ensuring health equity for all through preventive care and education.',
    verified: true,
    cause: 'Healthcare',
    location: 'Delhi, India',
    activeProjects: 15,
    completedProjects: 42,
    totalFundsRaised: 5200000,
    logo: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?w=800&h=400&fit=crop',
    yearFounded: 2010,
    registrationNumber: 'NGO-2010-DL-009012',
  },
  {
    id: '4',
    name: 'Women Empowerment Alliance',
    mission: 'Supporting women through skill training, financial literacy, and entrepreneurship programs.',
    vision: 'Building a society where women are economically independent and socially empowered.',
    verified: true,
    cause: 'Women Empowerment',
    location: 'Pune, India',
    activeProjects: 10,
    completedProjects: 28,
    totalFundsRaised: 1800000,
    logo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=800&h=400&fit=crop',
    yearFounded: 2017,
    registrationNumber: 'NGO-2017-MH-003456',
  },
  {
    id: '5',
    name: 'Child Welfare Trust',
    mission: 'Protecting children from abuse and providing safe shelters and rehabilitation programs.',
    vision: 'A safe world where every child grows up with dignity, care, and opportunity.',
    verified: false,
    cause: 'Child Welfare',
    location: 'Chennai, India',
    activeProjects: 6,
    completedProjects: 18,
    totalFundsRaised: 1200000,
    logo: 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=400&fit=crop',
    yearFounded: 2019,
    registrationNumber: 'NGO-2019-TN-007890',
  },
  {
    id: '6',
    name: 'Rural Development Collective',
    mission: 'Transforming rural communities through infrastructure development and livelihood programs.',
    vision: 'Bridging the urban-rural divide through inclusive development.',
    verified: true,
    cause: 'Rural Development',
    location: 'Jaipur, India',
    activeProjects: 9,
    completedProjects: 31,
    totalFundsRaised: 4100000,
    logo: 'https://images.unsplash.com/photo-1560264418-c4445382edbc?w=200&h=200&fit=crop',
    coverImage: 'https://images.unsplash.com/photo-1464047736614-af63643285bf?w=800&h=400&fit=crop',
    yearFounded: 2013,
    registrationNumber: 'NGO-2013-RJ-002345',
  },
];

export const mockProjects: Project[] = [
  {
    id: '1',
    ngoId: '1',
    ngoName: 'Education for All Foundation',
    title: 'Digital Literacy for Rural Schools',
    description: 'Bringing computer education and internet connectivity to 50 rural schools across Maharashtra.',
    cause: 'Education',
    location: 'Maharashtra, India',
    status: 'ongoing',
    fundingGoal: 500000,
    fundsRaised: 325000,
    startDate: '2024-01-15',
    endDate: '2026-12-31',
    beneficiaries: 5000,
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=600&h=400&fit=crop',
    requiredResources: ['Computers', 'Internet Infrastructure', 'Teaching Materials', 'Volunteer Teachers'],
    volunteersNeeded: 25,
    volunteersEnrolled: 18,
  },
  {
    id: '2',
    ngoId: '2',
    ngoName: 'Green Earth Initiative',
    title: 'Urban Forest Restoration',
    description: 'Planting 100,000 native trees in urban areas to improve air quality and biodiversity.',
    cause: 'Environment',
    location: 'Bangalore, India',
    status: 'ongoing',
    fundingGoal: 800000,
    fundsRaised: 650000,
    startDate: '2024-06-01',
    endDate: '2027-05-31',
    beneficiaries: 500000,
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop',
    requiredResources: ['Tree Saplings', 'Gardening Tools', 'Water Infrastructure', 'Maintenance Crew'],
    volunteersNeeded: 100,
    volunteersEnrolled: 82,
  },
  {
    id: '3',
    ngoId: '3',
    ngoName: 'Health First Community',
    title: 'Mobile Health Clinics',
    description: 'Deploying mobile medical units to provide free healthcare in remote villages.',
    cause: 'Healthcare',
    location: 'Rural Delhi NCR, India',
    status: 'ongoing',
    fundingGoal: 1200000,
    fundsRaised: 890000,
    startDate: '2023-09-01',
    endDate: '2026-08-31',
    beneficiaries: 25000,
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop',
    requiredResources: ['Medical Vans', 'Medical Equipment', 'Medicines', 'Healthcare Professionals'],
    volunteersNeeded: 40,
    volunteersEnrolled: 35,
  },
  {
    id: '4',
    ngoId: '4',
    ngoName: 'Women Empowerment Alliance',
    title: 'Women Entrepreneurship Program',
    description: 'Training 500 women in business skills and providing microfinance for starting small businesses.',
    cause: 'Women Empowerment',
    location: 'Pune, India',
    status: 'funded',
    fundingGoal: 600000,
    fundsRaised: 600000,
    startDate: '2024-03-01',
    endDate: '2025-02-28',
    beneficiaries: 500,
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&h=400&fit=crop',
    requiredResources: ['Training Materials', 'Seed Funding', 'Mentors', 'Business Equipment'],
    volunteersNeeded: 15,
    volunteersEnrolled: 15,
  },
  {
    id: '5',
    ngoId: '1',
    ngoName: 'Education for All Foundation',
    title: 'Girls STEM Education Initiative',
    description: 'Encouraging girls in underserved communities to pursue science, technology, engineering, and mathematics.',
    cause: 'Education',
    location: 'Mumbai, India',
    status: 'completed',
    fundingGoal: 400000,
    fundsRaised: 420000,
    startDate: '2022-07-01',
    endDate: '2024-06-30',
    beneficiaries: 2000,
    image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=600&h=400&fit=crop',
    requiredResources: ['Lab Equipment', 'STEM Kits', 'Scholarships', 'Mentors'],
    volunteersNeeded: 30,
    volunteersEnrolled: 30,
  },
  {
    id: '6',
    ngoId: '6',
    ngoName: 'Rural Development Collective',
    title: 'Clean Water Access Project',
    description: 'Installing water purification systems and borewells in 100 villages.',
    cause: 'Rural Development',
    location: 'Rajasthan, India',
    status: 'ongoing',
    fundingGoal: 950000,
    fundsRaised: 475000,
    startDate: '2024-04-01',
    endDate: '2026-03-31',
    beneficiaries: 50000,
    image: 'https://images.unsplash.com/photo-1541544537156-7627a7a4aa1c?w=600&h=400&fit=crop',
    requiredResources: ['Water Pumps', 'Purification Systems', 'Storage Tanks', 'Technical Staff'],
    volunteersNeeded: 20,
    volunteersEnrolled: 12,
  },
];

export const mockDonations: Donation[] = [
  {
    id: '1',
    donorId: 'donor-1',
    projectId: '1',
    projectName: 'Digital Literacy for Rural Schools',
    ngoName: 'Education for All Foundation',
    amount: 50000,
    date: '2024-12-15',
    receiptNumber: 'RCP-2024-001234',
    status: 'completed',
  },
  {
    id: '2',
    donorId: 'donor-1',
    projectId: '2',
    projectName: 'Urban Forest Restoration',
    ngoName: 'Green Earth Initiative',
    amount: 25000,
    date: '2024-11-20',
    receiptNumber: 'RCP-2024-001089',
    status: 'completed',
  },
  {
    id: '3',
    donorId: 'donor-1',
    projectId: '3',
    projectName: 'Mobile Health Clinics',
    ngoName: 'Health First Community',
    amount: 75000,
    date: '2024-10-05',
    receiptNumber: 'RCP-2024-000945',
    status: 'completed',
  },
  {
    id: '4',
    donorId: 'donor-1',
    projectId: '4',
    projectName: 'Women Entrepreneurship Program',
    ngoName: 'Women Empowerment Alliance',
    amount: 30000,
    date: '2024-09-12',
    receiptNumber: 'RCP-2024-000812',
    status: 'completed',
  },
];

export const mockVolunteerOpportunities: VolunteerOpportunity[] = [
  {
    id: '1',
    projectId: '1',
    projectName: 'Digital Literacy for Rural Schools',
    ngoName: 'Education for All Foundation',
    title: 'Computer Science Teacher',
    description: 'Teach basic computer skills to students in rural schools. Training will be provided.',
    skills: ['Teaching', 'Computer Science', 'Patience', 'Communication'],
    location: 'Maharashtra, India',
    duration: '6 months',
    commitment: '10 hours/week',
    spotsAvailable: 7,
  },
  {
    id: '2',
    projectId: '2',
    projectName: 'Urban Forest Restoration',
    ngoName: 'Green Earth Initiative',
    title: 'Tree Planting Coordinator',
    description: 'Coordinate tree planting activities and community engagement events.',
    skills: ['Event Management', 'Environmental Science', 'Leadership'],
    location: 'Bangalore, India',
    duration: '3 months',
    commitment: '8 hours/week',
    spotsAvailable: 18,
  },
  {
    id: '3',
    projectId: '3',
    projectName: 'Mobile Health Clinics',
    ngoName: 'Health First Community',
    title: 'Medical Assistant',
    description: 'Assist healthcare professionals in mobile clinics. Medical background preferred.',
    skills: ['Healthcare', 'First Aid', 'Patient Care'],
    location: 'Delhi NCR, India',
    duration: '1 year',
    commitment: '12 hours/week',
    spotsAvailable: 5,
  },
  {
    id: '4',
    projectId: '4',
    projectName: 'Women Entrepreneurship Program',
    ngoName: 'Women Empowerment Alliance',
    title: 'Business Mentor',
    description: 'Mentor women entrepreneurs on business development and financial planning.',
    skills: ['Business Management', 'Finance', 'Mentoring', 'Communication'],
    location: 'Pune, India',
    duration: '4 months',
    commitment: '5 hours/week',
    spotsAvailable: 0,
  },
  {
    id: '5',
    projectId: '6',
    projectName: 'Clean Water Access Project',
    ngoName: 'Rural Development Collective',
    title: 'Community Outreach Volunteer',
    description: 'Educate rural communities about water conservation and hygiene practices.',
    skills: ['Communication', 'Community Work', 'Public Speaking'],
    location: 'Rajasthan, India',
    duration: '2 months',
    commitment: '6 hours/week',
    spotsAvailable: 8,
  },
];

export const platformStats = {
  totalNGOs: 247,
  fundsRaised: 18500000,
  activeVolunteers: 3420,
  projectsCompleted: 892,
};
