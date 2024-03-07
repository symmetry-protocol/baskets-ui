import Image from "next/image";

const images = require.context('/public/static/levels', true);
const loadImage = imageName => (images(`./${imageName}.png`).default);

export const Level = ({level, size=24, className="rounded-full"}) => {
  return <Image className={`${className}`} src={loadImage(level)} alt={"Level "+level} width={size} height={size}/>
}