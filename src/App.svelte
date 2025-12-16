<script>
  import Router from "$lib/Router.svelte";
  import Route from "$lib/Route.svelte";
  import Navbar from "$components/Navbar.svelte";
  import Footer from "$components/Footer.svelte";
  import Landing from "./routes/Landing.svelte"; // Routes are usually kept relative or having their own alias
  import Doctors from "./routes/Doctors.svelte";
  import About from "./routes/About.svelte";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import DoctorProfile from "./routes/DoctorProfile.svelte";
  import DoctorRegister from "./routes/DoctorRegister.svelte";
  import DoctorDashboard from "./routes/DoctorDashboard.svelte";
  import Profile from "./routes/Profile.svelte";

  // Handle routing location
  export let url = "";
</script>

<Router url={url || undefined}>
  <div class="flex flex-col min-h-screen bg-slate-50">
    <Navbar />
    <main class="flex-1">
      <Route path="/" component={Landing} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/doctor/:id" component={DoctorProfile} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/doctor-register" component={DoctorRegister} />
      <Route path="/doctor-dashboard" component={DoctorDashboard} />
      <Route path="/profile" component={Profile} />
    </main>
    <Footer />
  </div>
</Router>
