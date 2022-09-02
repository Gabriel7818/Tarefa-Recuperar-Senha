import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Alert from 'react-bootstrap/Alert';
import { UserCircle } from "phosphor-react";
import { Envelope  } from "phosphor-react";
import { LockLaminated  } from "phosphor-react";
import api from "../../services/api";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import "./login.css";

export function Login() {
  const history = useHistory();

  const [user, setUser] = useState({
    email: "",
    password: ""
  });

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false,
  });

  const valorInput = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const loginSubmit = async (e) => {
    e.preventDefault();
    const headers = {
      "Content-Type": "application/json",
    };

    setStatus({
      loading: true,
    });

    await api.post("/user/login", user, { headers })
      .then((response) => {
        return history.push("/recoverypassword");
      })
      .catch((error) => {
        setStatus({
          type: "error",
          mensagem: "erro: tente mais tarde!",
        });
        if (error.response) {
          setStatus({
            type: "error",
            mensagem: error.response.data.mensagem,
            loading: false,
          });
        }
      });
  };

  return (
    <div className="box">
      <div class="context">
      </div>
      <div class="area">
        <ul class="circles">
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </div>
      <Form onSubmit={loginSubmit} className="borderForm">
        {status.type == "error" ? (
          <Alert variant="danger">{status.mensagem}</Alert>
        ) : (
          ""
        )}
        {status.type == "success" ? (
          <Alert variant="success">{status.mensagem}</Alert>
        ) : (
          ""
        )}
        {status.loading ? (
          <Alert variant="warning">Verificando...</Alert>
        ) : (
          ""
        )}
        <div className="user">
          <h1>Login</h1>
        </div>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <label className="FormLabel">
            E-mail:
          </label>
          <div className="aling-email">
            <Form.Control
              className="style-input"
              type="email"
              name="email"
              onChange={valorInput}
              required
              placeholder="Digite seu E-mail"
            />
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <label className="FormLabel">Senha:</label>
          <div className="aling-email">
            <Form.Control
              className="style-input"
              type="password"
              name="password"
              onChange={valorInput}
              required
              placeholder="Digite sua senha"
            />
          </div>
          <div className="aling-singnUp-pass">
            <p>
              <Link to="/recoverypassword" className="link-singUp-pass">
                Esqueceu sua Senha ?
              </Link>
            </p>
          </div>
        </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Entrar
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Entrar
          </Button>
        )}
      </Form>
    </div>
  );
}