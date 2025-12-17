<script>
    import Button from "$components/reusable/Button.svelte";
    import Icon from "$components/reusable/Icon.svelte";
    import { user } from "$lib/store";
    import { navigate } from "$lib/router.js";
    import { onMount } from "svelte";
    import Link from "$lib/Link.svelte";

    onMount(() => {
        if (!$user || $user.role !== "doctor") {
            navigate("/login", { replace: true });
        }
    });

    const patients = [
        {
            id: 1,
            name: "Sarah Johnson",
            time: "10:00 AM",
            date: "Today",
            reason: "General Checkup",
            status: "Upcoming",
            type: "Video",
        },
        {
            id: 2,
            name: "Michael Chen",
            time: "11:30 AM",
            date: "Today",
            reason: "Follow-up",
            status: "Upcoming",
            type: "In-Person",
        },
        {
            id: 3,
            name: "Emma Davis",
            time: "02:00 PM",
            date: "Today",
            reason: "Prescription Renewal",
            status: "Pending",
            type: "Video",
        },
        {
            id: 4,
            name: "James Wilson",
            time: "09:00 AM",
            date: "Tomorrow",
            reason: "Consultation",
            status: "Confirmed",
            type: "In-Person",
        },
    ];

    function getStatusColor(status) {
        switch (status.toLowerCase()) {
            case "upcoming":
            case "confirmed":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "completed":
                return "bg-green-100 text-green-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    }
</script>

{#if $user}
    <div class="min-h-screen bg-slate-50 py-12">
        <div class="container mx-auto px-4 max-w-6xl">
            <div class="flex justify-between items-center mb-8">
                <div>
                    <h1 class="text-3xl font-bold text-gray-900">Dashboard</h1>
                    <p class="text-gray-600">Welcome back, Dr. {$user.name}</p>
                </div>
                <div class="flex gap-4">
                    <Link
                        to="/profile"
                        class="px-4 py-2 bg-white border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 flex items-center gap-2"
                    >
                        <Icon name="user" size={16} /> Edit Profile
                    </Link>
                    <Button variant="primary" href="/doctor/me"
                        >View Public Profile</Button
                    >
                </div>
            </div>

            <!-- Stats Overview -->
            <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Total Patients
                    </div>
                    <div class="text-3xl font-bold text-gray-900">1,234</div>
                    <div class="text-green-600 text-sm mt-2">
                        ↑ 12% from last month
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Appointments
                    </div>
                    <div class="text-3xl font-bold text-gray-900">42</div>
                    <div class="text-blue-600 text-sm mt-2">
                        Upcoming this week
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Video Consults
                    </div>
                    <div class="text-3xl font-bold text-gray-900">18</div>
                    <div class="text-gray-600 text-sm mt-2">
                        Scheduled today
                    </div>
                </div>
                <div
                    class="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
                >
                    <div class="text-gray-500 text-sm font-medium mb-1">
                        Rating
                    </div>
                    <div class="text-3xl font-bold text-gray-900">4.9</div>
                    <div class="flex text-amber-500 text-sm mt-2">
                        {#each Array(5) as _}
                            <Icon name="star" size={14} fill="currentColor" />
                        {/each}
                    </div>
                </div>
            </div>

            <!-- Appointments List -->
            <div
                class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
                <div
                    class="p-6 border-b border-gray-100 flex justify-between items-center"
                >
                    <h2 class="text-xl font-bold text-gray-900">
                        Upcoming Appointments
                    </h2>
                    <button
                        class="text-primary hover:text-primary-dark font-medium text-sm"
                        >View All</button
                    >
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full">
                        <thead class="bg-gray-50">
                            <tr>
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Patient</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Date & Time</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Type</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Reason</th
                                >
                                <th
                                    class="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Status</th
                                >
                                <th
                                    class="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider"
                                    >Actions</th
                                >
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-100">
                            {#each patients as patient}
                                <tr class="hover:bg-gray-50 transition-colors">
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="flex items-center">
                                            <div
                                                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold mr-3"
                                            >
                                                {patient.name.charAt(0)}
                                            </div>
                                            <div>
                                                <div
                                                    class="text-sm font-medium text-gray-900"
                                                >
                                                    {patient.name}
                                                </div>
                                                <div
                                                    class="text-xs text-gray-500"
                                                >
                                                    ID: #{1000 + patient.id}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <div class="text-sm text-gray-900">
                                            {patient.date}
                                        </div>
                                        <div class="text-xs text-gray-500">
                                            {patient.time}
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class="inline-flex items-center gap-1 text-sm text-gray-700"
                                        >
                                            {#if patient.type === "Video"}
                                                <Icon name="video" size={14} /> Video
                                            {:else}
                                                <Icon name="user" size={14} /> In-Person
                                            {/if}
                                        </span>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                                    >
                                        {patient.reason}
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span
                                            class={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(patient.status)}`}
                                        >
                                            {patient.status}
                                        </span>
                                    </td>
                                    <td
                                        class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium"
                                    >
                                        <button
                                            class="text-primary hover:text-primary-dark mr-3"
                                            >View</button
                                        >
                                        {#if patient.status === "Upcoming" || patient.status === "Confirmed"}
                                            <button
                                                class="text-gray-400 hover:text-red-600"
                                                >Cancel</button
                                            >
                                        {/if}
                                    </td>
                                </tr>
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
{/if}
