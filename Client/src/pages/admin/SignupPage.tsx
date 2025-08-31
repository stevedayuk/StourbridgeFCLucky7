import {Card, Form} from "react-bootstrap";
import Button from "react-bootstrap/Button";
import {useState} from "react";
import { useCreateUserWithEmailAndPassword } from 'react-firebase-hooks/auth';
import {auth} from "../../firebase.ts";

export default function SignupPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [createUserWithEmailAndPassword, user, loading, error] = useCreateUserWithEmailAndPassword(auth);

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!email || !password) {
            return;
        }

        createUserWithEmailAndPassword(email, password);
    }

    if (error) {
        return (
            <div>
                <p>Error: {error.message}</p>
            </div>
        );
    }
    if (loading) {
        return <p>Loading...</p>;
    }
    if (user) {
        return (
            <div>
                <p>Registered User: {user.user.email}</p>
            </div>
        );
    }

    return <>
        <Card>
            <Card.Body>
                <h2 className={"text-center mb-4"}>Sign Up</h2>
            </Card.Body>
            <Form>
                <Form.Group id={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type={"email"}
                                  value={email}
                                  onChange={e => setEmail(e.target.value)}
                                  required />
                </Form.Group>
                <Form.Group id={"password"}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={"password"}
                                  value={password}
                                  onChange={e => setPassword(e.target.value)}
                                  required />
                </Form.Group>
                <Form.Group id={"password-confirm"}>
                    <Form.Label>Password Confirmation</Form.Label>
                    <Form.Control type={"password"}
                                  value={passwordConfirm}
                                  onChange={e => setPasswordConfirm(e.target.value)}
                                  required />
                </Form.Group>
                <Button className={"w-100"} type={"submit"} onClick={handleSubmit}>Sign Up</Button>
            </Form>
        </Card>
        <div className={"w-100 text-center mt-2"}>
            Already have an account? Log In
        </div>
    </>
}