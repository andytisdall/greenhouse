import React from 'react';
import { Field, reduxForm } from 'redux-form';



class AddButton extends React.Component {

    constructor(props) {
        super(props);
        this.ref = React.createRef();
    }

    state = { boxVisible: false, selectedOption: null };

    componentDidUpdate(prevProps, prevState) {
        if (prevState.boxVisible === false && this.state.boxVisible === true) {
            document.addEventListener('click', this.bodyClick, {capture: true});
            document.addEventListener('keydown', this.blockSpaceBarPress, {capture: true});
        } else if (prevState.boxVisible === true && this.state.boxVisible === false) {
            document.removeEventListener('click', this.bodyClick, {capture: true});
            document.removeEventListener('keydown', this.blockSpaceBarPress, {capture: true});
        }
        
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.bodyClick, {capture: true});
        document.removeEventListener('keydown', this.blockSpaceBarPress, {capture: true});
    }

    blockSpaceBarPress = (e) => {
        e.stopPropagation();
    }

    bodyClick = (e) => {
        if (this.ref.current && this.ref.current.contains(e.target)) {
            return;
        }
        if (this.state.boxVisible) {
            this.setState({ boxVisible: false });
        }
    }

    showOptions = (field) => {
        return field.options.map(option => {
            return (
                <option
                    key={option.value}
                    value={option.value}
                >
                    {option.display}
                </option>
            );
        });
    };

    onFileInput = (e, input) => {
        e.preventDefault();
        const { onChange } = input;
        onChange(e.target.files[0]);
    }

    input = (field) => {
        let addClass = '';
        if (field.type === 'date') {
            addClass = 'calendar';
        }

        if (field.type !== 'file') {

            return (
                <input
                    {...field.input}
                    autoFocus={field.autoFocus}
                    type={field.type}
                    className={addClass}
                />
            );
        } else {
            delete field.input.value;
            return (
                <input
                    {...field.input}
                    type='file'
                    className='inputfile'
                    onChange={(e) => this.onFileInput(e, field.input)}    
                />
            );
        }


    }

    showFields = () => {

        return this.props.fields.map((field, i) => {
            const autoFocus = i === 0 ? true : false;
            let comp = this.input;
            if (field.type === 'select') {
                comp = 'select'
            }
            return <div key={field.label}>
                <label>{field.label}: </label>
                <Field
                    name={field.name}
                    component={comp}
                    autoFocus={autoFocus}
                    type={field.type}
                >
                    {field.options ? this.showOptions(field) : null}
                </Field>
            </div>
        });
 
    };

    submitForm = (formValues) => {
        this.props.onSubmit(formValues);
        this.setState({ boxVisible: false });
        this.props.reset();
    }

    showBox = () => {
        if (this.state.boxVisible) {
            const addClass = this.props.addClass ? this.props.addClass : '';
            return <>    
                <div className={`addbox ${addClass}`} ref={this.ref} >
                    <h3 className="addbox-title">{this.props.title}</h3>
                    <form onSubmit = {this.props.handleSubmit(this.submitForm)}>
                        {this.showFields()}
                        <button className="submit-button" type='submit'>OK</button>
                    </form>
                </div>
            </>
        }
    }

    click = (e) => {
        e.stopPropagation();
        this.setState({ boxVisible: !this.boxVisible });
    }
    
    render() {
        return (
            <div className="add" onClick={this.click} >
                <img src={this.props.image} />
                {this.showBox()}
            </div>
        );
    }

}

export default reduxForm({ form: 'form' })(AddButton);