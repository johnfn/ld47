import React, { useEffect } from 'react';


export const Portrait = ({fileName}: {fileName: string}) => {
  const [image, setImage] = React.useState();

  useEffect(() => {
    loadImage(fileName);
  }, []);

  const loadImage = (imageName: string) => {
    import(`./images/${imageName}.png`).then(image => {
      setImage(image);
    });
  };

  return (<div></div>);
}