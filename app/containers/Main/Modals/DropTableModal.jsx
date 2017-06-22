// @flow
import React from 'react';
import { connect } from 'react-redux';
import type { Connector } from 'react-redux';
import { bindActionCreators } from 'redux';

import { Field, reduxForm, formValueSelector } from 'redux-form';

import * as modalActions from '../../../actions/modal';
import * as tablesActions from '../../../actions/tables';

import { RenderRadio } from '../../../components/shared/InputComponents';
import Modal from '../../../components/shared/Modal/Modal';

import type { State } from '../../../types';

import {
  MainContainer,
  Header,
  Content,
  CloseButton,
  ActionButton,
  ButtonsGroup,
  ModalTools,
  ToolContainer,
  ToolHeader,
  ToolDescription,
  ToolErrorMessage,
  ActionDescription,
  ToolName,
} from './styled';


type Props = {
  dropTableName: ?string,
  dropTableErrorMessage: ?string,
  show: boolean,
  isCascade: boolean,
  hideDropTableModal: () => void,
  dropTableRequest: ({ tableName: string, isCascade: boolean }) => void
};

const DropTableModal = ({
  dropTableName, dropTableErrorMessage,
  show, isCascade,
  hideDropTableModal, dropTableRequest,
}: Props) => {
  if (!show) {
    return null;
  }

  return (
    <Modal onHide={hideDropTableModal}>
      <MainContainer>
        <Header>
          Do you want to drop {dropTableName}?
          <ActionDescription>
            This can not be undone.
          </ActionDescription>
        </Header>
        <Content>
          <ModalTools>
            <ToolContainer>
              <ToolHeader>
                <Field
                  name="isCascade"
                  component={RenderRadio}
                  type="checkbox"
                  normalize={value => value || false}
                />
                <ToolName>
                  Cascade
                </ToolName>
              </ToolHeader>
              <ToolDescription>
                Also truncate tables with foreign key constraints
                depending on the truncated tables.
              </ToolDescription>
              <ToolErrorMessage>
                {dropTableErrorMessage}
              </ToolErrorMessage>
            </ToolContainer>
          </ModalTools>
        </Content>
        <ButtonsGroup>
          <ActionButton
            onClick={() => {
              if (dropTableName) {
                dropTableRequest({ tableName: dropTableName, isCascade });
              }
            }}
          >
            Drop
          </ActionButton>
          <CloseButton onClick={hideDropTableModal}>
            Close
          </CloseButton>
        </ButtonsGroup>
      </MainContainer>
    </Modal>
  );
};

function mapDispatchToProps(dispatch: Dispatch): {[key: string]: Function} {
  return bindActionCreators({ ...modalActions, ...tablesActions }, dispatch);
}

const selector = formValueSelector('DropTableFormModal');
function mapStateToProps(state: State) {
  return {
    isCascade: selector(state, 'isCascade') || false,
    show: state.modal.showDropTableModal,
    dropTableName: state.modal.dropTableName,
    dropTableErrorMessage: state.modal.dropTableErrorMessage,
  };
}

const connector: Connector<{}, Props> = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default reduxForm({
  form: 'DropTableFormModal',
  initialValues: {
    cascade: false,
  },
})(connector(DropTableModal));
