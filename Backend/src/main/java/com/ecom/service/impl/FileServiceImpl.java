package com.ecom.service.impl;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.ecom.exception.ImageExtensionNotValidException;
import com.ecom.service.FileService;

import lombok.extern.slf4j.Slf4j;
@Service
@Slf4j
public class FileServiceImpl implements FileService {

	@Override
	public String uploadFile(MultipartFile file, String path) throws IOException {
		String originalFileName=file.getOriginalFilename();
		String extension=originalFileName.substring(originalFileName.lastIndexOf("."));
		log.info("Original File Name {}",originalFileName);
		String fileName=UUID.randomUUID().toString()+extension;
		
		String fullPathWithFileName=path+File.separator+fileName;
		
		if(extension.equalsIgnoreCase(".png") || extension.equalsIgnoreCase(".jpg") || extension.equalsIgnoreCase(".jpeg")) {
			//This Will Create Folder At Given Path
			File folder=new File(path);
			
			if(!folder.exists()) {
				folder.mkdirs();
			}
			Files.copy(file.getInputStream(), Paths.get(fullPathWithFileName), StandardCopyOption.REPLACE_EXISTING);
			
		}else {
			throw new ImageExtensionNotValidException("Image With extension "+extension+" is Not Acceptable Please Add Either jpg jpeg or png");
		}
		
		return fileName;
	}

	@Override
	public InputStream getResource(String path, String name) throws FileNotFoundException {
		String fullPathWithFileName=path+File.separator+name;
		InputStream inputStream=new FileInputStream(fullPathWithFileName);
		return inputStream;
	}

}
