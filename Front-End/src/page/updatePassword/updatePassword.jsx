import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import api from "../../services/api";
import { UserCircle } from "phosphor-react";
import Button from "react-bootstrap/Button";
import Alert from 'react-bootstrap/Alert';
import Form from "react-bootstrap/Form";
import "./updatePassword.css";

export const updatePassword = () => {
  const history = useHistory();

  const [status, setStatus] = useState({
    type: "",
    mensagem: "",
    loading: false,
  });

  const [user, setUser] = useState({
    email: "",
    verificationcode: "",
    password: "",
  });

  const valorInput = (e) =>
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  const formSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true });
    const headers = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    await api
      .post("/user/updatepassword", user, headers)
      .then((response) => {
        setStatus({ loading: false });
        return history.push("/");
      })
      .catch((err) => {
        if (err.response) {
          setStatus({
            type: "error",
            mensagem: err.response.data.mensagem,
            loading: false,
          });
        } else {
          setStatus({
            type: "error",
            mensagem: "Erro: Tente Novamente Mais Tarde !",
            loading: false,
          });
        }
      });
  };
  return (
    <div className="box">
      <Form onSubmit={formSubmit} className="borderForm">
        <Alert variant="success">E-mail Encaminhado com Sucesso !</Alert>
        <h1>Recuperação de senha</h1>
        <br />
        {status.type == "error" ? (
          <h3 className="p-alert-error">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.type == "success" ? (
          <h3 className="p-alert-success">{status.mensagem}</h3>
        ) : (
          ""
        )}
        {status.loading ? (
          <h3 className="p-alert-validando">Validando...</h3>
        ) : (
          ""
        )}
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Label className="FormLabel">E-mail:</Form.Label>
          <Form.Control
            type="email"
            name="email"
            onChange={valorInput}
            placeholder="Digite o seu e-mail"
          />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicText">
          <Form.Label className="FormLabel">Código de verificação:</Form.Label>
          <Form.Control
            type="text"
            name="verificationcode"
            onChange={valorInput}
            placeholder="Digite o seu código"
          />
        </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="FormLabel">Nova senha:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              onChange={valorInput}
              placeholder="Digite a sua nova senha"
              required
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="FormLabel">Confirme a senha:</Form.Label>
            <Form.Control
              type="password"
              name="confirmpassword"
              onChange={valorInput}
              placeholder="Digite a sua nova senha novamente"
              required
            />
          </Form.Group>
        {status.loading ? (
          <Button variant="Secondary" disabled type="submit">
            Aguarde...
          </Button>
        ) : (
          <Button variant="dark" type="submit">
            Enviar
          </Button>
        )}
      </Form>
    </div>
  );
};
