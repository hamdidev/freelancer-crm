import { Head } from "@inertiajs/react";

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
                <p className="text-gray-600">Welcome to FreelancerCRM</p>
            </div>
        </>
    );
}
