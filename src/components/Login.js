import { Button, Form, Input, Checkbox } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import UserAPI from "../api/UserAPI";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Login() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const showToast = (type, message) => {
        if (type === "success") {
            toast.success(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        } else {
            toast.error(message, {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
            });
        }
    };

    const onFinish = async (values) => {
        console.log("Received values of form: ", values);
        setLoading(true);
        try {
            const response = await UserAPI.login(values.email, values.password);
            console.log('API response:', response);
            if (response.token) {
                showToast("success", response.message || "Login Successfully");
                localStorage.setItem("accessToken", response.token);
                localStorage.setItem('userId', response.id);
                setTimeout(() => {
                    navigate("/notes");
                }, 2000);
            } else {
                showToast("error", response.message || "Login Failed!");
            }
        } catch (error) {
            console.error('Error during login:', error);
            let errorMessage = "Login Failed!";
            if (error && typeof error === 'object') {
                if (error.response && error.response.data) {
                    errorMessage = JSON.stringify(error.response.data);
                } else if (error.data) {
                    errorMessage = JSON.stringify(error.data);
                } else {
                    errorMessage = JSON.stringify(error);
                }
            } else if (typeof error === 'string') {
                errorMessage = error;
            }

            showToast("error", errorMessage);
        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="flex items-center w-full min-h-screen">
            <div className="mx-auto w-96">
                <div className="text-center mb-8">
                    <svg
                        width="33"
                        height="32"
                        viewBox="0 0 33 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <rect x="0.125" width="32" height="32" rx="6.4" fill="#1890FF" />
                        <path
                            d="M19.3251 4.80005H27.3251V12.8H19.3251V4.80005Z"
                            fill="white"
                        />
                        <path d="M12.925 12.8H19.3251V19.2H12.925V12.8Z" fill="white" />
                        <path d="M4.92505 17.6H14.525V27.2001H4.92505V17.6Z" fill="white" />
                    </svg>
                    <h2 className="text-3xl font-bold mt-4">Login</h2>
                </div>
                <Form
                    name="normal_login"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark="optional"
                >
                    <div className="">
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    type: "email",
                                    required: true,
                                    message: "Please input your Email!",
                                },
                            ]}
                        >
                            <Input
                                prefix={<MailOutlined className="text-xl" />}
                                placeholder="Email"
                                className="h-12"
                            />
                        </Form.Item>
                    </div>

                    <Form.Item
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Password!",
                            },
                        ]}
                    >
                        <Input.Password
                            className="h-12"
                            prefix={<LockOutlined className="text-xl" />}
                            type="password"
                            placeholder="Password"
                        />
                    </Form.Item>

                    <Form.Item
                        name="remember"
                        valuePropName="checked"
                        className="flex justify-start"
                    >
                        <Checkbox>Remember me</Checkbox>
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button block type="primary" htmlType="submit" loading={loading}>
                            Login
                        </Button>
                        <div className="flex justify-between mt-6">
                            <a href="/forgot-password" className="text-blue-500">
                                Forgot password?
                            </a>
                            <a href="/register" className="text-blue-500">
                                Do not have an account? Sign Up
                            </a>
                        </div>
                    </Form.Item>
                </Form>
            </div>
            <ToastContainer />
        </section>
    );
}
