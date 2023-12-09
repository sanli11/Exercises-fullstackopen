const Filter = ({ value, onChange }) => (
  <>
    Filter shown with:{" "}
    <input type="search" value={value} onChange={onChange} />
  </>
);
export default Filter;
