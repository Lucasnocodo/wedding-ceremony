// /src/BlessingsModal.js
import React, { useState } from "react";
import styled from "styled-components";
import { addBlessing } from "./api";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled.div`
  background: #fff;
  border-radius: 12px;
  padding: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.3);
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #333;
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 8px;
  resize: vertical;
  font-size: 1rem;
`;

const InputFile = styled.input`
  margin-top: 10px;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
  gap: 10px;
`;

const Button = styled.button`
  padding: 8px 12px;
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

const BlessingsModal = ({ onClose }) => {
  const [message, setMessage] = useState("");
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // 送出祝福到 Firestore
      const newId = await addBlessing({ text: message });
      console.log("Blessing added with ID:", newId);
      alert("祝福已送出！");
    } catch (error) {
      alert("送出祝福失敗，請稍後再試。");
    }
    onClose();
  };

  return (
    <ModalOverlay>
      <ModalContent>
        <Title>送上祝福</Title>
        <form onSubmit={handleSubmit}>
          <TextArea
            rows="4"
            placeholder="在這裡寫下你的祝福..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <InputFile
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            accept="image/*,video/*,audio/*"
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