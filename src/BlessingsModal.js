import React, { useState } from "react";
import styled from "styled-components";
import { addBlessing } from "./api";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: linear-gradient(135deg, #ffb6c1, #ffc0cb);
  border: 2px solid rgba(255, 255, 255, 0.8);
  border-radius: 16px;
  padding: 30px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
  margin: 1rem;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #fff;
  font-size: 2rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 10px 16px;
  font-size: 1rem;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: #ff7eb3;
  color: white;
  transition: background 0.3s;
  &:hover {
    background: #ff5e99;
  }
`;

const CancelButton = styled(Button)`
  background: #ccc;
  color: #333;
  &:hover {
    background: #bbb;
  }
`;

const BlessingsModal = ({ onClose, onNewBlessing }) => {
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newId = await addBlessing({ text: message });
      const newBlessing = { id: newId, text: message, createdAt: new Date() };
      onNewBlessing(newBlessing);
      onClose();
    } catch (error) {
      console.error("Error adding blessing: ", error);
      onClose();
    }
  };

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <Title>送上公開祝福</Title>
        <form onSubmit={handleSubmit}>
          <TextArea
            rows="4"
            placeholder="ex: 達:祝福你們長長久久"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <ButtonRow>
            <CancelButton type="button" onClick={onClose}>
              取消
            </CancelButton>
            <Button type="submit">送出祝福</Button>
          </ButtonRow>
        </form>
      </ModalContent>
    </ModalOverlay>
  );
};

export default BlessingsModal;