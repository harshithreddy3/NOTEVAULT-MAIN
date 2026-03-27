import { useNavigate, Outlet } from 'react-router-dom';
import { useRecoilValue } from "recoil";
import { userAtom } from "../recoil/atoms/userAtom";
import React, { useEffect } from 'react';

const ProtectedRoute = () => {
    const navigate = useNavigate();

    const userInfo = useRecoilValue(userAtom);
    const token = localStorage.getItem("token");
    const check = () => {
        if (!userInfo && !token) {
            navigate('/signin')
        }
    }
    useEffect(() => {
        check()
    }, [])

    return <Outlet />;
};

export default ProtectedRoute;
