<script>
  import Button from "$components/reusable/Button.svelte";
  import Hero from "$components/landing/Hero.svelte";
  import Features from "$components/landing/Features.svelte";
  import HowItWorks from "$components/landing/HowItWorks.svelte";
  import Stats from "$components/landing/Stats.svelte";
  import Testimonials from "$components/landing/Testimonials.svelte";
  import { isSignupModalOpen } from "$lib/store";
</script>

<div class="overflow-x-hidden">
  <Hero />
  <Features />
  <HowItWorks />
  <Stats />
  <Testimonials />

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
          <Button variant="primary" onClick={() => isSignupModalOpen.set(true)}
            >Get Started Free</Button
          >
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

  :global(.animate-fade-in-up) {
    animation: fade-in-up 0.8s ease-out forwards;
  }

  :global(.animate-fade-in-right) {
    animation: fade-in-right 1s ease-out 0.3s forwards;
  }
</style>
