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
  <section class="py-32 relative overflow-hidden bg-[#000921]">
    <!-- Animated Ornaments -->
    <div
      class="absolute top-0 left-0 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-[120px] -ml-40 -mt-40"
    ></div>
    <div
      class="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-[100px] -mr-20 -mb-20"
    ></div>

    <div class="container mx-auto px-6 text-center relative z-10">
      <div class="max-w-4xl mx-auto">
        <div
          class="inline-flex items-center gap-2 px-4 py-2 bg-white/5 text-secondary rounded-full text-sm font-bold mb-8 border border-white/10"
        >
          <Icon name="heart" size={16} />
          Join Our Growing Community
        </div>

        <h2
          class="text-5xl lg:text-7xl font-black text-white mb-8 leading-[1.1]"
        >
          Ready to Prioritize <br />
          <span
            class="bg-clip-text text-transparent bg-gradient-to-r from-secondary to-[#00a8b0]"
            >Your Health?</span
          >
        </h2>

        <p
          class="text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
        >
          Take the first step towards a healthier you. Book your appointment
          with a specialist in just a few clicks.
        </p>

        <div class="flex flex-wrap gap-6 justify-center">
          <Button
            variant="primary"
            size="lg"
            onClick={() => isSignupModalOpen.set(true)}
            className="px-10 py-5 text-xl rounded-2xl shadow-2xl shadow-secondary/20"
          >
            Get Started Free
          </Button>
          <Button
            variant="outline"
            size="lg"
            href="/doctors"
            className="px-10 py-5 text-xl rounded-2xl border-white/20 text-white hover:bg-white/10"
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
