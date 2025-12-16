export const doctors = [
    {
        id: 1,
        name: "Dr. Sarah Smith",
        specialty: "Cardiologist",
        location: "New York, NY",
        rating: 4.9,
        reviews: 120,
        bio: "Dr. Sarah Smith is a board-certified cardiologist with over 15 years of experience in treating complex heart conditions. She is dedicated to providing personalized care to her patients.",
        education: "MD from Harvard Medical School",
        experience: "15+ Years",
        languages: ["English", "Spanish"],
        about: "Dr. Smith specializes in preventative cardiology and heart failure management. She believes in a holistic approach to heart health.",
        clinicAddress: "123 Heart Ave, New York, NY 10001",
        availability: [
            { day: "Mon", slots: ["09:00 AM", "10:00 AM", "02:00 PM"] },
            { day: "Tue", slots: ["11:00 AM", "03:00 PM"] },
            { day: "Thu", slots: ["09:00 AM", "01:00 PM"] },
        ],
    },
    {
        id: 2,
        name: "Dr. Michael Chen",
        specialty: "Dermatologist",
        location: "San Francisco, CA",
        rating: 4.8,
        reviews: 95,
        bio: "Dr. Michael Chen is a leading dermatologist known for his expertise in both cosmetic and medical dermatology.",
        education: "MD from Stanford University",
        experience: "12 Years",
        languages: ["English", "Mandarin"],
        about: "Dr. Chen focuses on skin cancer prevention and advanced cosmetic procedures. He is passionate about helping patients achieve healthy skin.",
        clinicAddress: "456 Skin Blvd, San Francisco, CA 94101",
        availability: [
            { day: "Wed", slots: ["10:00 AM", "02:00 PM", "04:00 PM"] },
            { day: "Fri", slots: ["09:00 AM", "11:00 AM"] },
        ],
    },
    {
        id: 3,
        name: "Dr. Emily Johnson",
        specialty: "Pediatrician",
        location: "Chicago, IL",
        rating: 4.9,
        reviews: 150,
        bio: "Dr. Emily Johnson loves working with children and interacting with families to ensure the best health outcomes for kids.",
        education: "MD from John Hopkins University",
        experience: "10 Years",
        languages: ["English", "French"],
        about: "Dr. Johnson provides comprehensive pediatric care from newborns to adolescents. She has a special interest in developmental pediatrics.",
        clinicAddress: "789 Kids Way, Chicago, IL 60601",
        availability: [
            { day: "Mon", slots: ["08:30 AM", "11:30 AM"] },
            { day: "Tue", slots: ["09:00 AM", "02:00 PM", "04:30 PM"] },
            { day: "Thu", slots: ["10:00 AM", "03:30 PM"] },
        ],
    },
    {
        id: 4,
        name: "Dr. David Wilson",
        specialty: "Neurologist",
        location: "Houston, TX",
        rating: 4.7,
        reviews: 80,
        bio: "Dr. David Wilson is specializing in neurological disorders including migraine, epilepsy, and stroke.",
        education: "MD from Baylor College of Medicine",
        experience: "18 Years",
        languages: ["English"],
        about: "Dr. Wilson is committed to using the latest research and technology to diagnose and treat neurological conditions effectively.",
        clinicAddress: "321 Brain Ln, Houston, TX 77001",
        availability: [
            { day: "Wed", slots: ["09:00 AM", "01:00 PM"] },
            { day: "Fri", slots: ["11:00 AM", "03:00 PM"] },
        ],
    },
    {
        id: 5,
        name: "Dr. Jessica Brown",
        specialty: "Orthopedic Surgeon",
        location: "Miami, FL",
        rating: 4.9,
        reviews: 110,
        bio: "Dr. Jessica Brown is an expert in sports medicine and joint replacement surgery.",
        education: "MD from University of Miami",
        experience: "14 Years",
        languages: ["English", "Spanish", "Portuguese"],
        about: "Dr. Brown helps athletes and active individuals return to their peak performance through advanced surgical and non-surgical treatments.",
        clinicAddress: "654 Bone St, Miami, FL 33101",
        availability: [
            { day: "Mon", slots: ["08:00 AM", "12:00 PM"] },
            { day: "Wed", slots: ["02:00 PM", "05:00 PM"] },
        ],
    },
    {
        id: 6,
        name: "Dr. Robert Taylor",
        specialty: "Ophthalmologist",
        location: "Seattle, WA",
        rating: 4.8,
        reviews: 90,
        bio: "Dr. Robert Taylor specializes in cataract surgery and glaucoma management.",
        education: "MD from University of Washington",
        experience: "20 Years",
        languages: ["English"],
        about: "Dr. Taylor is dedicated to preserving and restoring vision. He utilizes state-of-the-art diagnostic and surgical techniques.",
        clinicAddress: "987 Vision Ct, Seattle, WA 98101",
        availability: [
            { day: "Tue", slots: ["09:00 AM", "01:00 PM"] },
            { day: "Thu", slots: ["10:00 AM", "02:00 PM", "04:00 PM"] },
        ],
    },
];

export const stats = [
    { value: 0, target: 500, suffix: "+", label: "Verified Doctors" },
    { value: 0, target: 10000, suffix: "+", label: "Happy Patients" },
    { value: 0, target: 50, suffix: "+", label: "Specialties" },
    { value: 0, target: 98, suffix: "%", label: "Satisfaction Rate" },
];

export const features = [
    {
        icon: "🔍",
        title: "Find Doctors",
        desc: "Search by specialty, location, or availability to find the right care for you.",
    },
    {
        icon: "📹",
        title: "Video Consults",
        desc: "Consult with doctors from the comfort of your home via secure video calls.",
    },
    {
        icon: "📋",
        title: "Digital Records",
        desc: "Keep all your medical history, prescriptions, and reports centralized.",
    },
    {
        icon: "📅",
        title: "Easy Scheduling",
        desc: "Book appointments instantly with real-time availability updates.",
    },
    {
        icon: "💊",
        title: "E-Prescriptions",
        desc: "Receive digital prescriptions and order medications online.",
    },
    {
        icon: "🔔",
        title: "Smart Reminders",
        desc: "Never miss an appointment or medication with automated notifications.",
    },
];

export const testimonials = [
    {
        text: "MediConnect made it so easy to find a specialist for my condition. The video consultation was seamless and saved me hours of travel time.",
        name: "Sarah Johnson",
        role: "Patient since 2023",
        img: "/images/testimonial-sarah.png",
    },
    {
        text: "Having all my medical records in one place is a game-changer. I can share them with any doctor instantly without carrying physical files.",
        name: "Michael Chen",
        role: "Patient since 2022",
        img: "/images/testimonial-michael.png",
    },
    {
        text: "The appointment reminders and prescription tracking features help me stay on top of my health. Highly recommend for seniors!",
        name: "Priya Patel",
        role: "Patient since 2021",
        img: "/images/testimonial-priya.png",
    },
];

export const steps = [
    {
        num: "1",
        title: "Create Your Profile",
        desc: "Sign up and add your medical history securely in minutes.",
    },
    {
        num: "2",
        title: "Find Your Doctor",
        desc: "Search and filter doctors by specialty, ratings, and availability.",
    },
    {
        num: "3",
        title: "Book & Consult",
        desc: "Schedule appointments and consult via video or in-person visits.",
    },
];
