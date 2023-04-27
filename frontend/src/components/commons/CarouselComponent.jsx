import React from "react";
import { Carousel } from "react-bootstrap";

const CarouselComponent = ({images}) => {
  return (
    <Carousel>
      {images.map((image, index) => (
        <Carousel.Item key={index}>
          <div style={{ height: '100vh' }}>
            <img
              className="d-block mx-auto"
              style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
              }}
              src={image.src}
              alt={image.alt}
            />
          </div>
          <Carousel.Caption>
            <h3 className="carousel-text">{image.title}</h3>
            <p className="carousel-text">{image.description}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>

  );
};

export default CarouselComponent;