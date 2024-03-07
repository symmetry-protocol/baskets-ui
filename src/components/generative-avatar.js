import Avatar from "boring-avatars";


const GenerativeAvatar = ({seed="Untitled", size="24", imageURI=null, className=""}) => {

  if(imageURI)
  return <img src={imageURI} alt={seed} className="overflow-hidden rounded-full relative flex items-center justify-center" width={size} height={size}/>

  return <div className={"overflow-hidden rounded-full relative flex items-center justify-center " + className} style={{width:size, height:size}}>
    <Avatar
    size={size}
    name={seed}
    variant="bauhaus"
    className="z-10"
    colors={['#49007e', '#ff005b', '#F0AB3D', '#ff7d10', "#e63946","#f1baae","#a8dadc","#457b9d","#1d3557"]}
  />
  <p className="absolute text-xs opacity-50">{seed.length > 3 ? seed.slice(0,3).toUpperCase() : seed.toUpperCase()}</p>
  </div>
}

export default GenerativeAvatar;