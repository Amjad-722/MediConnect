<script>
  import Button from "$components/reusable/Button.svelte";
  import Icon from "$components/reusable/Icon.svelte";
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
    class="py-20 sm:py-28 lg:py-32 relative overflow-hidden bg-[#000921]"
  >
    <!-- Animated Ornaments -->
    <div
      class="absolute top-0 left-0 w-[300px] sm:w-[450px] lg:w-[600px] h-[300px] sm:h-[450px] lg:h-[600px] bg-secondary/10 rounded-full blur-[80px] sm:blur-[100px] lg:blur-[120px] -ml-20 sm:-ml-30 lg:-ml-40 -mt-20 sm:-mt-30 lg:-mt-40"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[250px] sm:w-[375px] lg:w-[500px] h-[250px] sm:h-[375px] lg:h-[500px] bg-blue-500/5 rounded-full blur-[60px] sm:blur-[80px] lg:blur-[100px] -mr-10 sm:-mr-15 lg:-mr-20 -mb-10 sm:-mb-15 lg:-mb-20"
    ></div>

    <div class="container mx-auto px-4 sm:px-6 text-center relative z-10">
      <div class="max-w-4xl mx-auto">
        <div
          class="inline-flex items-center gap-2 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/5 text-secondary rounded-full text-xs sm:text-sm font-bold mb-6 sm:mb-8 border border-white/10"
        >
          <Icon name="heart" size={16} />
          Join Our Growing Community
        </div>

        <h2
          class="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-black text-white mb-6 sm:mb-8 leading-[1.1]"
        >
          Ready to Prioritize <br class="hidden sm:block" />
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-[#00a8b0]"
            >Your Health?</span
          >
        </h2>

        <p
          class="text-base sm:text-lg lg:text-xl text-gray-400 mb-8 sm:mb-10 lg:mb-12 max-w-2xl mx-auto leading-relaxed px-4"
        >
          Take the first step towards a healthier you. Book your appointment
          with a specialist in just a few clicks.
        </p>

        <div
          class="flex flex-col sm:flex-row flex-wrap gap-4 sm:gap-6 justify-center px-4"
        >
          <Button
            variant="primary"
            size="lg"
            onClick={() => isSignupModalOpen.set(true)}
            className="px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-xl sm:rounded-2xl shadow-2xl shadow-secondary/20 w-full sm:w-auto"
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/doctors"
            className="px-8 sm:px-10 py-4 sm:py-5 text-lg sm:text-xl rounded-xl sm:rounded-2xl border-white/20 text-white hover:bg-white/10 w-full sm:w-auto"
          >
            Browse Doctors
          </Button>
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
