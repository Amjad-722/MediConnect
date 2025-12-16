<script>
  import Button from "../components/Button.svelte";
  import { onMount } from "svelte";

  let statsVisible = false;
  let stats = [
    { value: 0, target: 500, suffix: "+", label: "Verified Doctors" },
    { value: 0, target: 10000, suffix: "+", label: "Happy Patients" },
    { value: 0, target: 50, suffix: "+", label: "Specialties" },
    { value: 0, target: 98, suffix: "%", label: "Satisfaction Rate" },
  ];

  onMount(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !statsVisible) {
          statsVisible = true;
          animateStats();
        }
      });
    });

    const statsSection = document.querySelector(".stats");
    if (statsSection) {
      observer.observe(statsSection);
    }

    return () => observer.disconnect();
  });

  function animateStats() {
    stats.forEach((stat, index) => {
      const duration = 2000;
      const steps = 60;
      const increment = stat.target / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= stat.target) {
          stats[index].value = stat.target;
          clearInterval(timer);
        } else {
          stats[index].value = Math.floor(current);
        }
        stats = [...stats];
      }, duration / steps);
    });
  }
</script>

<div class="overflow-x-hidden">
  <!-- Hero Section -->
  <section
    class="relative py-32 pb-48 overflow-hidden bg-gradient-to-br from-blue-50 via-blue-100 to-blue-200"
  >
    <!-- Background Decoration -->
    <div
      class="absolute -top-1/2 -right-[20%] w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-secondary/15 to-transparent animate-pulse z-0"
    ></div>

    <div
      class="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-16 items-center relative z-10 text-center lg:text-left"
    >
      <div class="space-y-6">
        <h1
          class="text-5xl lg:text-6xl font-bold text-primary-dark leading-tight animate-fade-in-up"
        >
          Healthcare Made <span
            class="text-transparent bg-clip-text bg-gradient-to-br from-secondary to-[#00a8b0]"
            >Accessible</span
          >
        </h1>
        <p
          class="text-xl text-gray-500 max-w-lg leading-relaxed animate-fade-in-up delay-200 mx-auto lg:mx-0"
        >
          Connect with top doctors, book appointments, and manage your health
          records - all in one place.
        </p>
        <div
          class="flex flex-wrap gap-4 justify-center lg:justify-start animate-fade-in-up delay-400 mb-12"
        >
          <Button variant="primary" href="/doctors">Find a Doctor</Button>
          <Button variant="outline" href="/about">Learn More</Button>
        </div>
        <div
          class="flex flex-wrap gap-12 justify-center lg:justify-start animate-fade-in-up delay-600"
        >
          <div class="flex flex-col gap-1">
            <strong class="text-2xl font-bold text-primary">24/7</strong>
            <span class="text-sm text-gray-500">Available</span>
          </div>
          <div class="flex flex-col gap-1">
            <strong class="text-2xl font-bold text-primary">100%</strong>
            <span class="text-sm text-gray-500">Secure</span>
          </div>
          <div class="flex flex-col gap-1">
            <strong class="text-2xl font-bold text-primary">Instant</strong>
            <span class="text-sm text-gray-500">Booking</span>
          </div>
        </div>
      </div>
      <div class="relative animate-fade-in-right delay-300">
        <img
          src="/images/hero-doctors.png"
          alt="Healthcare professionals"
          class="w-full h-auto rounded-3xl shadow-[0_20px_60px_rgba(0,80,157,0.2)] hover:scale-[1.02] transition-transform duration-300"
        />
      </div>
    </div>

    <!-- Hero Wave -->
    <div class="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
      <svg
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        class="relative block w-[calc(100%+1.3px)] h-[120px]"
      >
        <path
          d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
          class="fill-white opacity-25"
        ></path>
        <path
          d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
          class="fill-white opacity-50"
        ></path>
        <path
          d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
          class="fill-white"
        ></path>
      </svg>
    </div>
  </section>

  <!-- Features Section -->
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <h2
        class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
      >
        Why Choose MediConnect?
      </h2>
      <p class="text-center text-lg text-gray-500 mb-16">
        Experience healthcare that puts you first
      </p>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <!-- Feature Cards -->
        {#each [{ icon: "🔍", title: "Find Doctors", desc: "Search by specialty, location, or availability to find the right care for you." }, { icon: "📹", title: "Video Consults", desc: "Consult with doctors from the comfort of your home via secure video calls." }, { icon: "📋", title: "Digital Records", desc: "Keep all your medical history, prescriptions, and reports centralized." }, { icon: "📅", title: "Easy Scheduling", desc: "Book appointments instantly with real-time availability updates." }, { icon: "💊", title: "E-Prescriptions", desc: "Receive digital prescriptions and order medications online." }, { icon: "🔔", title: "Smart Reminders", desc: "Never miss an appointment or medication with automated notifications." }] as feature}
          <div
            class="group relative p-10 bg-white rounded-2xl shadow-md border border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,80,157,0.15)] hover:border-primary-light overflow-hidden"
          >
            <div
              class="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-secondary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"
            ></div>
            <div
              class="w-20 h-20 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center mb-6 transition-all duration-300 group-hover:bg-gradient-to-br group-hover:from-primary-light group-hover:to-secondary group-hover:rotate-[10deg] group-hover:scale-110"
            >
              <div class="text-4xl">{feature.icon}</div>
            </div>
            <h3 class="text-xl font-semibold text-primary mb-4">
              {feature.title}
            </h3>
            <p class="text-gray-500 leading-relaxed">{feature.desc}</p>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- How It Works Section -->
  <section class="py-24 bg-gradient-to-b from-white to-slate-50">
    <div class="container mx-auto px-4">
      <h2
        class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
      >
        How It Works
      </h2>
      <p class="text-center text-lg text-gray-500 mb-16">
        Get started in three simple steps
      </p>
      <div class="flex flex-wrap justify-center gap-8 mt-16">
        {#each [{ num: "1", title: "Create Your Profile", desc: "Sign up and add your medical history securely in minutes." }, { num: "2", title: "Find Your Doctor", desc: "Search and filter doctors by specialty, ratings, and availability." }, { num: "3", title: "Book & Consult", desc: "Schedule appointments and consult via video or in-person visits." }] as step, i}
          <div
            class="flex-1 min-w-[250px] max-w-[300px] text-center group relative"
          >
            <div
              class="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-primary-light text-white flex items-center justify-center text-2xl font-bold shadow-[0_10px_30px_rgba(0,80,157,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-[5deg]"
            >
              {step.num}
            </div>
            <h3 class="text-2xl font-semibold text-primary-dark mb-3">
              {step.title}
            </h3>
            <p class="text-gray-500 leading-relaxed">{step.desc}</p>
          </div>
          {#if i < 2}
            <div
              class="hidden lg:block w-24 h-0.5 mt-10 bg-gradient-to-r from-primary-light to-secondary relative after:content-['→'] after:absolute after:-right-4 after:-top-3 after:text-secondary after:text-2xl"
            ></div>
          {/if}
        {/each}
      </div>
    </div>
  </section>

  <!-- Stats Section -->
  <section
    class="stats py-20 bg-gradient-to-br from-primary-dark to-primary text-white"
  >
    <div class="container mx-auto px-4">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-12">
        {#each stats as stat}
          <div class="text-center">
            <div
              class="text-5xl lg:text-6xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-br from-white to-blue-100"
            >
              {stat.value}{stat.suffix}
            </div>
            <div class="text-lg opacity-90">{stat.label}</div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- Testimonials Section -->
  <section class="py-24 bg-white">
    <div class="container mx-auto px-4">
      <h2
        class="text-center text-4xl lg:text-5xl font-bold text-primary-dark mb-4"
      >
        What Our Patients Say
      </h2>
      <p class="text-center text-lg text-gray-500 mb-16">
        Real stories from real people
      </p>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        {#each [{ text: "MediConnect made it so easy to find a specialist for my condition. The video consultation was seamless and saved me hours of travel time.", name: "Sarah Johnson", role: "Patient since 2023", img: "/images/testimonial-sarah.png" }, { text: "Having all my medical records in one place is a game-changer. I can share them with any doctor instantly without carrying physical files.", name: "Michael Chen", role: "Patient since 2022", img: "/images/testimonial-michael.png" }, { text: "The appointment reminders and prescription tracking features help me stay on top of my health. Highly recommend for seniors!", name: "Priya Patel", role: "Patient since 2021", img: "/images/testimonial-priya.png" }] as testimonial}
          <div
            class="p-10 bg-white rounded-2xl shadow-md border-2 border-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,80,157,0.15)] hover:border-secondary"
          >
            <div class="text-xl mb-6">⭐⭐⭐⭐⭐</div>
            <p class="text-lg leading-relaxed text-gray-900 italic mb-8">
              "{testimonial.text}"
            </p>
            <div class="flex items-center gap-4">
              <img
                src={testimonial.img}
                alt={testimonial.name}
                class="w-16 h-16 rounded-full object-cover border-4 border-primary-light"
              />
              <div class="flex flex-col">
                <strong class="text-primary-dark font-semibold"
                  >{testimonial.name}</strong
                >
                <span class="text-sm text-gray-500">{testimonial.role}</span>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA Section -->
  <section
    class="py-24 relative overflow-hidden bg-gradient-to-br from-blue-50 to-blue-200"
  >
    <div
      class="absolute -top-1/2 -left-[20%] w-[600px] h-[600px] rounded-full bg-gradient-radial from-secondary/20 to-transparent"
    ></div>
    <div class="container mx-auto px-4 text-center relative z-10">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-4xl lg:text-5xl font-bold text-primary-dark mb-4">
          Ready to Take Control of Your Health?
        </h2>
        <p class="text-xl text-gray-500 mb-10">
          Join thousands of patients who trust MediConnect for their healthcare
          needs.
        </p>
        <div class="flex flex-wrap gap-4 justify-center">
          <Button variant="primary" href="/signup">Get Started Free</Button>
          <Button variant="outline" href="/doctors">Browse Doctors</Button>
        </div>
      </div>
    </div>
  </section>
</div>

<style>
  @keyframes fade-in-up {
    from {
      opacity: 0;
      transform: translateY(30px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes fade-in-right {
    from {
      opacity: 0;
      transform: translateX(50px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }

  .animate-fade-in-right {
    animation: fade-in-right 1s ease-out 0.3s forwards;
  }

  /* Responsive Design */
  @media (max-width: 968px) {
    .hero {
      padding: 5rem 0 8rem;
    }

    .hero-content {
      grid-template-columns: 1fr;
      text-align: center;
      gap: 3rem;
    }

    .hero-title {
      font-size: 2.5rem;
    }

    .hero-subtitle {
      max-width: 100%;
    }

    .hero-actions {
      justify-content: center;
    }

    .hero-stats {
      justify-content: center;
    }

    .section-title {
      font-size: 2rem;
    }

    .step-connector {
      display: none;
    }

    .cta-content h2 {
      font-size: 2rem;
    }

    .stats-grid {
      gap: 2rem;
    }

    .stat-value {
      font-size: 2.5rem;
    }
  }

  @media (max-width: 640px) {
    .hero-title {
      font-size: 2rem;
    }

    .hero-stats {
      flex-direction: column;
      gap: 1rem;
      align-items: center;
    }

    .hero-actions {
      flex-direction: column;
      width: 100%;
    }
  }
</style>
