import {Container, Form} from "react-bootstrap";
import {useRef} from "react";
import Button from "react-bootstrap/Button";
import {auth} from "../../firebase.ts";
import styles from './LoginPage.module.css';
import Alert from "react-bootstrap/Alert";
import {useSignInWithEmailAndPassword} from "react-firebase-hooks/auth";

export default function LoginPage() {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [signInWithEmailAndPassword, user, , error] = useSignInWithEmailAndPassword(auth);

    const redirectUrl = new URLSearchParams(window.location.search).get('redirectUrl');

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!emailRef.current || !passwordRef.current) {
            return;
        }

        try {
            await signInWithEmailAndPassword(emailRef.current.value, passwordRef.current.value);

            if (!user) {
                return;
            }

            if (redirectUrl) {
                window.location.href = redirectUrl;
            } else {
                window.location.href = "/admin";
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    }

    return (
        <Container className={styles.loginContainer}>
            <div>
                <h1>Admin Login</h1>
                <p>Please enter your email and password to log in.</p>
            </div>

            {error && <div>
                <Alert variant={"danger"}>
                    <div>
                        Sorry - we weren't able to log you in.
                    </div>
                    <small>
                        {error.message}
                    </small>
                </Alert>
            </div>}

            <Form>
                <Form.Group id={"email"}>
                    <Form.Label>Email</Form.Label>
                    <Form.Control type={"email"}
                                  ref={emailRef}
                                  required/>
                </Form.Group>
                <Form.Group id={"password"} className={"mt-2"}>
                    <Form.Label>Password</Form.Label>
                    <Form.Control type={"password"}
                                  ref={passwordRef}
                                  required/>
                </Form.Group>
                <div className={"mt-3"}>
                    <Button className={"w-100"} type={"submit"} onClick={handleSubmit}>Login</Button>
                </div>


            </Form>

            <div className={styles.unauthorisedUseMessage}>
                <Alert variant={"danger"}>
                    This system is currently for use by Stourbridge Football Club staff and authorised third parties only. Any other use is strictly prohibited.
                </Alert>
            </div>
        </Container>
    )
}