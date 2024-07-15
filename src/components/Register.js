import { Button, Form, Input } from "antd";
import { LockOutlined, MailOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import UserAPI from "../api/UserAPI";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

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


        const payload = {
            email: values.email,
            username: values.username,
            phone_number: values.phone,
            password: values.password,
        };

        try {
            const response = await UserAPI.register(payload);
            if (response.message) {
                showToast("success", "Registration Successful");
                setTimeout(() => {
                    navigate("/login");
                }, 2000);
            } else {
                showToast("error", response.message || "Registration Failed!");
            }
        } catch (error) {
            console.error('Error during registration:', error);
            let errorMessage = "Registration Failed!";
            if (error && typeof error === 'object') {
                if (error.response && error.response.data) {
                    errorMessage = error.response.data.error || JSON.stringify(error.response.data);
                } else if (error.data) {
                    errorMessage = error.data.error || JSON.stringify(error.data);
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


    const validatePasswords = (_, value) => {
        const password = form.getFieldValue('password');
        if (password && value !== password) {
            return Promise.reject(new Error('The two passwords do not match!'));
        }
        return Promise.resolve();
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
                    <h2 className="text-3xl font-bold mt-4">Register</h2>
                </div>
                <Form
                    form={form}
                    name="normal_register"
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
                        name="username"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Username!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<UserOutlined className="text-xl" />}
                            placeholder="Username"
                            className="h-12"
                        />
                    </Form.Item>

                    <Form.Item
                        name="phone"
                        rules={[
                            {
                                required: true,
                                message: "Please input your Phone Number!",
                            },
                        ]}
                    >
                        <Input
                            prefix={<PhoneOutlined className="text-xl" />}
                            placeholder="Phone Number"
                            className="h-12"
                        />
                    </Form.Item>

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
                        name="confirmPassword"
                        dependencies={['password']}
                        rules={[
                            {
                                required: true,
                                message: "Please confirm your Password!",
                            },
                            {
                                validator: validatePasswords,
                            },
                        ]}
                    >
                        <Input.Password
                            className="h-12"
                            prefix={<LockOutlined className="text-xl" />}
                            type="password"
                            placeholder="Confirm Password"
                        />
                    </Form.Item>

                    <Form.Item className="mb-0">
                        <Button block type="primary" htmlType="submit" loading={loading}>
                            Register
                        </Button>
                        <div className="flex justify-between mt-6">
                            <a href="/login" className="text-blue-500">
                                Already have an account? Login
                            </a>
                        </div>
                    </Form.Item>
                </Form>
            </div>
            <ToastContainer />
        </section>
    );
}
