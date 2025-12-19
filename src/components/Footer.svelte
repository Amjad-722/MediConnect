<script>
  import Icon from "$components/reusable/Icon.svelte";
</script>

<footer
  class="bg-[#000921] text-white pt-24 pb-8 rounded-tl-[100px] mt-20 relative overflow-hidden"
>
  <div class="container mx-auto px-6 md:px-12">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      <!-- Logo & Description -->
      <div class="space-y-6">
        <div class="flex items-center gap-2">
          <div
            class="w-10 h-10 bg-white rounded-lg flex items-center justify-center"
          >
            <Icon
              name="activity"
              size={24}
              className="text-[#000921]"
              strokeWidth={3}
            />
          </div>
          <span class="text-2xl font-bold tracking-tight">MediConnect</span>
        </div>
        <p class="text-gray-400 leading-relaxed max-w-xs">
          Connecting you with healthcare professionals seamlessly. Join our
          community for better health management and instant access to top
          doctors.
        </p>
      </div>

      <!-- Office Section -->
      <div>
        <h4 class="text-lg text-white font-bold mb-8 relative inline-block">
          Office
          <div class="absolute -bottom-2 left-0 w-full flex gap-1">
            <span class="h-1 w-1/3 bg-white rounded-full"></span>
            <span class="h-1 w-2/3 bg-gray-600 rounded-full"></span>
          </div>
        </h4>
        <div class="space-y-4 text-gray-400">
          <p class="flex items-start gap-3">
            <Icon
              name="map-pin"
              size={18}
              className="text-white mt-1 flex-shrink-0"
            />
            <span>123 Health Avenue,<br />Central District, NY 10001</span>
          </p>
          <p class="flex items-center gap-3">
            <Icon name="mail" size={18} className="text-white flex-shrink-0" />
            <a
              href="mailto:info@mediconnect.com"
              class="hover:text-white transition-colors"
              >aliamjad722ee@gmail.com</a
            >
          </p>
          <p class="flex items-center gap-3">
            <Icon name="phone" size={18} className="text-white flex-shrink-0" />
            <a
              href="tel:+10123456789"
              class="hover:text-white transition-colors">+1 - 01</a
            >
          </p>
        </div>
      </div>

      <!-- Links Section -->
      <div>
        <h4 class="text-lg text-white font-bold mb-8 relative inline-block">
          Links
          <div class="absolute -bottom-2 left-0 w-full flex gap-1">
            <span class="h-1 w-1/3 bg-white rounded-full"></span>
            <span class="h-1 w-2/3 bg-gray-600 rounded-full"></span>
          </div>
        </h4>
        <ul class="space-y-3">
          <li>
            <a href="/" class="text-gray-400 hover:text-white transition-colors"
              >Home</a
            >
          </li>
          <li>
            <a
              href="/doctors"
              class="text-gray-400 hover:text-white transition-colors"
              >Services</a
            >
          </li>
          <li>
            <a
              href="/about"
              class="text-gray-400 hover:text-white transition-colors"
              >About Us</a
            >
          </li>
          <li>
            <a
              href="/clinics"
              class="text-gray-400 hover:text-white transition-colors"
              >Clinics</a
            >
          </li>
          <li>
            <a
              href="/contact"
              class="text-gray-400 hover:text-white transition-colors"
              >Contacts</a
            >
          </li>
        </ul>
      </div>

      <!-- Newsletter Section -->
      <div>
        <h4 class="text-lg text-white font-bold mb-8 relative inline-block">
          Newsletter
          <div class="absolute -bottom-2 left-0 w-full flex gap-1">
            <span class="h-1 w-1/3 bg-white rounded-full"></span>
            <span class="h-1 w-2/3 bg-gray-600 rounded-full"></span>
          </div>
        </h4>
        <div class="space-y-6">
          <form class="relative group" on:submit|preventDefault>
            <div
              class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-white transition-colors"
            >
              <Icon name="mail" size={20} />
            </div>
            <input
              type="email"
              placeholder="Enter your email id"
              class="w-full bg-transparent border-b border-gray-600 py-3 pl-12 pr-10 focus:outline-none focus:border-white transition-all text-sm"
            />
            <button
              class="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
            >
              <Icon name="arrow-right" size={20} />
            </button>
          </form>

          <div class="flex gap-4">
            <button
              type="button"
              class="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#000921] rounded-full flex items-center justify-center transition-all duration-300"
            >
              <Icon name="facebook" size={20} fill="currentColor" />
            </button>
            <button
              type="button"
              class="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#000921] rounded-full flex items-center justify-center transition-all duration-300"
            >
              <Icon name="twitter" size={20} fill="currentColor" />
            </button>
            <button
              type="button"
              class="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#000921] rounded-full flex items-center justify-center transition-all duration-300"
            >
              <Icon name="bell" size={20} fill="currentColor" />
            </button>
            <button
              type="button"
              class="w-10 h-10 bg-white/10 hover:bg-white hover:text-[#000921] rounded-full flex items-center justify-center transition-all duration-300"
            >
              <Icon name="activity" size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div
      class="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-center items-center gap-4 text-gray-500 text-sm"
    >
      <p>MediConnect © {new Date().getFullYear()} - All Rights Reserved</p>
    </div>
  </div>
</footer>

<style>
  footer {
    box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.2);
  }
</style>
