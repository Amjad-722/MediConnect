<script>
  import Router from "$features/routing/Router.svelte";
  import Route from "$features/routing/Route.svelte";
  import Navbar from "$components/layout/Navbar.svelte";
  import Footer from "$components/layout/Footer.svelte";
  import DashboardLayout from "$components/layout/DashboardLayout.svelte";
  import Landing from "./routes/Landing.svelte"; // Routes are usually kept relative or having their own alias
  import Doctors from "./routes/Doctors.svelte";
  import About from "./routes/About.svelte";
  import Login from "./routes/Login.svelte";
  import Register from "./routes/Register.svelte";
  import DoctorProfile from "./routes/DoctorProfile.svelte";
  import DoctorRegister from "./routes/DoctorRegister.svelte";
  import DoctorDashboard from "./routes/DoctorDashboard.svelte";
  import PatientDashboard from "./routes/PatientDashboard.svelte";
  import Profile from "./routes/Profile.svelte";
  import SignupTypeModal from "$features/auth/SignupTypeModal.svelte";
  import NotificationToast from "$features/reminders/NotificationToast.svelte";
  import { onMount } from "svelte";
  import { startReminderService } from "$features/reminders/ReminderService";
  import { currentPath } from "$features/routing/router";

  onMount(() => {
    startReminderService();
  });

  // Handle routing location
  export let url = "";

  // Hide navbar on dashboard routes
  $: isDashboardRoute =
    $currentPath.startsWith("/doctor-dashboard") ||
    $currentPath.startsWith("/patient-dashboard");
</script>

<Router url={url || undefined}>
  <div class="flex flex-col min-h-screen bg-slate-50">
    {#if !isDashboardRoute}
      <Navbar />
    {/if}
    <NotificationToast />
    <SignupTypeModal />
    <main class="flex-1">
      <Route path="/" component={Landing} />
      <Route path="/doctors" component={Doctors} />
      <Route path="/doctor/:id" component={DoctorProfile} />
      <Route path="/about" component={About} />
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />
      <Route path="/doctor-register" component={DoctorRegister} />
      <Route path="/doctor-dashboard">
        <DashboardLayout userRole="doctor">
          <DoctorDashboard />
        </DashboardLayout>
      </Route>
      <Route path="/patient-dashboard">
        <DashboardLayout userRole="patient">
          <PatientDashboard />
        </DashboardLayout>
      </Route>
      <Route path="/profile" component={Profile} />
    </main>
    {#if !isDashboardRoute}
      <Footer />
    {/if}
  </div>
</Router>
