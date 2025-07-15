package com.ecom.service;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public interface FileService {

	//Method To Upload File
	public String uploadFile(MultipartFile file,String path) throws IOException;
	
	//Method To Get file
	public InputStream getResource(String path,String name) throws FileNotFoundException;
}
