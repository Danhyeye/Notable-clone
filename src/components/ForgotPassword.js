import { Button, Form, Input } from "antd";
import { MailOutlined } from "@ant-design/icons";

export default function ForgotPassword() {
    return (
        <div>
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
                        <h2 className="text-3xl font-bold mt-4">Reset Password</h2>
                    </div>
                    <Form
                        name="normal_signup"
                        // onFinish={onFinish}
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
                        <Form.Item className="mb-0">
                            <Button block type="primary" htmlType="submit">
                                Reset Password
                            </Button>

                        </Form.Item>
                    </Form>
                </div>
            </section>
        </div>
    )
}
