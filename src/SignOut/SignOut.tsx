import React, { useEffect } from "react";
import Swal from "sweetalert2";

const SignOut: React.FC = () => {
    useEffect(() => {
        Swal.fire({
            title: "Are you sure?",
            text: "Do you want to log out?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
            allowOutsideClick: false, // Prevent closing on outside click
            allowEscapeKey: false, // Prevent closing on escape key
            allowEnterKey: false, // Prevent closing on enter key
        }).then((result) => {
            if (result.isConfirmed) {
            // Remove the sessionStorage key
            localStorage.removeItem("sessionStorage");
            Swal.fire("Logged Out!", "You have been logged out.", "success").then(() => {
                // Redirect to sign-in path
                window.location.href = "/signin";
            });
            } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Redirect to dashboard path
                window.location.href = "/dashboard";
            }
        });
    }, []); // Empty dependency array ensures this runs only once on mount

    return null; // No UI needed since the popup is shown immediately
};

export default SignOut;
