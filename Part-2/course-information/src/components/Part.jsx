const Part = ({part}) => {
    console.log("Part data", part);

    return (
        <p>{part.name} {part.exercises}</p>
    );
}

export default Part;