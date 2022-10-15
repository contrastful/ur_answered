import React, { useState, useEffect } from 'react';
import { classNames } from 'primereact/utils';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Tag } from 'primereact/tag';
import { Chip } from 'primereact/chip';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { TriStateCheckbox } from 'primereact/tristatecheckbox';
import './DataTableDemo.css';
import QuestionsService from './service/QuestionService';

const Questions = () => {
    const [questions, setQuestions] = useState(null);
    const [active, setActive] = useState(null);

    const [filters, setFilters] = useState({
        'category': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'questions': { value: null, matchMode: FilterMatchMode.CONTAINS },
        'status': { value: null, matchMode: FilterMatchMode.EQUALS },
    });

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        QuestionsService.fetchQuestions().then(data => { setQuestions(data); setLoading(false) });
    }, []);

    useEffect(() => {
        console.log(active)
    }, [active])

    const formatDate = (value) => {
        return value.toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        });
    }

    const categoryBodyTemplate = (rowData) => {
        return <Tag value={ rowData.category } />;
        // return <Chip label={ rowData.category } />;
    }
    const statusBodyTemplate = (rowData) => {
        // return <i className={classNames('pi', {'true-icon pi-check-circle': rowData.status, 'false-icon pi-times-circle': !rowData.status })}></i>;
        return <Tag value={ rowData.status ? 'Answered' : 'Unanswered'} severity={ rowData.status ? 'success' : 'danger'} icon={rowData.status ? 'pi pi-check-circle' : 'pi pi-times-circle'} />;
    }

    const statusRowFilterTemplate = (options) => {
        return <TriStateCheckbox value={options.value} onChange={(e) => options.filterApplyCallback(e.value)} />
    }

    const questionBodyTemplate = (rowData) => {
        return (
            <div>
                <a href="#" class="questionLink" onClick={() => { setActive(rowData) }}>{ rowData.questions[0] }</a>
                {
                    rowData.questions.length > 1 ? (
                        <Chip label={ `+${ rowData.questions.length - 1 }` } style={{ transform: 'scale(0.8)', marginLeft: '.5rem' }} />
                    ) : null
                }
            </div>
        )
    }

    const renderModalFooter = () => {
        return (
            <div>
                <Button label="Question irrelevant" icon="pi pi-trash" onClick={() => setActive(null)} className="p-button-text" />
                <Button label="Save answer" icon="pi pi-check" onClick={() => setActive(null)} autoFocus />
            </div>
        );
    }

    return (
        <div>
            <Dialog
                header="Knowledge entry"
                maximizable={ true }
                draggable={ false }
                dismissableMask={ true }
                visible={ active }
                style={{ width: '70vw' }}
                footer={renderModalFooter()}
                onHide={() => setActive(null)}
            >
                { active ? (
                    <div>
                        <div className="text-500 mb-5">Morbi tristique blandit turpis. In viverra ligula id nulla hendrerit rutrum.</div>
                        <ul className="list-none p-0 m-0">
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Question ID</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    { active.questionTag }
                                </div>
                                <div className="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Questions</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                   { active.questions.map(q =>
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
                                    { active.answer ? active.answer : <Chip label='Awaiting answer' /> }
                                </div>
                                <div className="w-6 md:w-2 flex justify-content-end">
                                    <Button label="Edit" icon="pi pi-pencil" className="p-button-text" />
                                </div>
                            </li>
                            <li className="flex align-items-center py-3 px-2 border-top-1 border-300 flex-wrap">
                                <div className="text-500 w-6 md:w-2 font-medium">Asked by</div>
                                <div className="text-900 w-full md:w-8 md:flex-order-0 flex-order-1">
                                    { active.askedBy ? active.askedBy : <Chip label='Sourced from knowledge base' /> }
                                </div>
                            </li>
                        </ul>
                    </div>
                ) : null }
            </Dialog>

            {/* <div className="card"> */}
                <DataTable value={questions} paginator className="p-datatable-questions" rows={5}
                    dataKey="id" filters={filters} filterDisplay="row" loading={loading} responsiveLayout="scroll"
                    emptyMessage="No questions found.">
                    <Column field="category" body={categoryBodyTemplate} header="Category" filter filterPlaceholder="Search by category" style={{ width: '30rem' }} />
                    <Column field="questions" body={questionBodyTemplate} header="Question" filter filterPlaceholder="Search by question" style={{ minWidth: '1rem', maxWidth: '15rem' }} />
                    <Column field="askedCount" header="Number of queries" style={{ maxWidth: '5rem' }} sortable />
                    <Column field="status" dataType="boolean" header="Answered" style={{ minWidth: '1rem', maxWidth: '5rem' }} body={statusBodyTemplate} filter filterElement={statusRowFilterTemplate} />
                </DataTable>
            {/* </div> */}
        </div>
    );
}

export default Questions