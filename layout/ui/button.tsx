"use client"
import React from 'react';
import { FaCircleChevronRight } from "react-icons/fa6";
import Button from "@mui/material/Button";

const ButtonUI: React.FC = () => {
    return (
        <div>
            <Button variant="contained"> Submit  <FaCircleChevronRight /> </Button>
        </div>
    );
}
export default ButtonUI;
