import { Chip } from 'primereact/chip';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Inplace, InplaceDisplay, InplaceContent } from 'primereact/inplace';
import { useState } from 'react';

export const EditEntry = (props) => {
    const [editedQuestionTag, setQuestionTag] = useState(null)
    const [editedAnswer, setAnswer] = useState(null)

    return (
        <div>
            <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
            <ul className="list-none p-0 m-0">
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Question ID</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        <Inplace closable active={editedQuestionTag} onToggle={(e) => { if (editedQuestionTag) {props.entry.questionTag = editedQuestionTag; setQuestionTag(null) } else {setQuestionTag(props.entry.questionTag)} }}>
                            <InplaceDisplay>
                                { props.entry.questionTag }
                            </InplaceDisplay>
                            <InplaceContent>
                                <InputText size={ 40 } value={ editedQuestionTag } onChange={(e) => setQuestionTag(e.target.value)} />
                            </InplaceContent>
                        </Inplace>
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" onClick={() => { setQuestionTag(props.entry.questionTag )}} />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Questions</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { props.entry.questions.map(q =>
                            <Chip label={ q } className="mr-2" />
                        )}
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Answer</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        {
                            !editedAnswer ? (
                                <div>
                                    { props.entry.answer ? props.entry.answer : <Chip label='Awaiting answer' /> }
                                </div>
                            ) : (
                                <InputTextarea rows={5} cols={ 60 } value={ editedAnswer } onChange={(e) => setAnswer(e.target.value)} />
                            )
                        }
                        {/* <Inplace closable active={editedAnswer} onToggle={(e) => { if (editedAnswer) {props.entry.answer = editedAnswer; setAnswer(null) } else {setAnswer(props.entry.answer)} }}> */}
                            {/* <InplaceDisplay> */}
                            {/* </InplaceDisplay> */}
                            {/* <InplaceContent> */}
                            {/* </InplaceContent> */}
                        {/* </Inplace> */}
                    </div>
                    <div className="w-6 md:w-2 flex justify-content-end">
                        <Button label="Edit" icon="pi pi-pencil" className="p-button-text" onClick={() => { setAnswer(props.entry.answer )}} />
                    </div>
                </li>
                <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                    <div className="text-500 w-6 md:w-2 font-medium">Asked by</div>
                    <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                        { props.entry.askedBy ? props.entry.askedBy : <Chip label='Sourced from knowledge base' /> }
                    </div>
                </li>
            </ul>
        </div>
    )
}

export default EditEntry