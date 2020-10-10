import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import fileSize from 'filesize';
import Header from '../../components/Header';
import FileList from '../../components/FileList';
import Upload from '../../components/Upload';

import { Container, Title, ImportFileContainer, Footer } from './styles';

import alert from '../../assets/alert.svg';
import api from '../../services/api';

interface FileProps {
  file: File;
  name: string;
  readableSize: string;
}

const Import: React.FC = () => {
  const [uploadedFiles, setUploadedFiles] = useState<FileProps[]>([]);
  const history = useHistory();

  async function handleUpload(): Promise<void> {
    if (!uploadedFiles.length) return;

    const [fileInfo] = uploadedFiles;
    const { file, name: fileName } = fileInfo;

    const data = new FormData();
    data.append('file', file, fileName);

    try {
      await api.post('/transactions/import', data);
      history.push('/');
    } catch (err) {
      console.error(err.response.error);
    }
  }

  function submitFile(files: File[]): void {
    const filesProp = files.map(file => {
      const { name, size } = file;
      return {
        file,
        name,
        readableSize: fileSize(size),
      };
    });

    setUploadedFiles(filesProp);
  }

  return (
    <>
      <Header size="small" />
      <Container>
        <Title>Importar uma transação</Title>
        <ImportFileContainer>
          <Upload onUpload={submitFile} />
          {!!uploadedFiles.length && <FileList files={uploadedFiles} />}

          <Footer>
            <p>
              <img src={alert} alt="Alert" />
              Permitido apenas arquivos CSV
            </p>
            <button onClick={handleUpload} type="button">
              Enviar
            </button>
          </Footer>
        </ImportFileContainer>
      </Container>
    </>
  );
};

export default Import;
