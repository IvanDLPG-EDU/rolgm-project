import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { CarouselComponent } from "../components";

export const HomePage = () => {
  const images = [
    {
      src: "/media/home-slide1.jpg",
      alt: "Bienvenido a RolGM",
      title: "¡Bienvenido a RolGM!",
      description: "Esperamos que disfrutes de tu estancia en nuestra Web.",
    },
    {
      src: "/media/home-slide2.jpg",
      alt: "¿No sabes por dónde empezar?",
      title: "¿No sabes por dónde empezar?",
      description:
        "Si ya estás registrado, ¿por qué no creas o te unes a una sala?",
    },
    {
      src: "/media/home-slide3.jpg",
      alt: "Las malas lenguas hablan",
      title: "¡Se rumorea algo!",
      description: "¿Escuchaste eso? Hablan sobre una actualización mayor...",
    },
  ];
  return (
    <>
      <CarouselComponent images={images} />
    </>
  );
};

export default HomePage;
