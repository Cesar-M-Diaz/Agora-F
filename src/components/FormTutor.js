const FormTutor = ({ addData }) => {
  return (
    <>
      <div className="form__inputs">
        <input type="text" placeholder="Profession" name="Profession" onChange={addData} />
      </div>
      <div className="form__inputs">
        <input type="text" placeholder="Focus" name="Focus" onChange={addData} />
      </div>
    </>
  )
}

export default FormTutor;