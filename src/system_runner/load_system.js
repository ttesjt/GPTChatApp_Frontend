export class SystemLoader{
    constructor() {
      // need the url for lambda#2, which is the user url
      this.request_url = "[url_to_fill]";
    }

    async post_to_database_url(request_json) {
        const finished_response = await fetch(this.request_url, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify(request_json)
        })
        .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then(data => {
          return data; // Return the data so it gets passed to the termination callback
        })
        .catch(error => {
          console.error('Error:', error);
        });
        
        return finished_response;
    }

    async post_file_to_presigned_url(presignedPostData, file) {
      const formData = new FormData();
      // Add all the fields from the response to the FormData
      Object.keys(presignedPostData.fields).forEach((key) => {
        formData.append(key, presignedPostData.fields[key]);
      });
    
      // Append the file to the FormData
      formData.append('file', file);
    
      // Send the POST request to the presigned URL
      const response = await fetch(presignedPostData.url, {
        method: 'POST',
        body: formData,
      });
    
      if (!response.ok) {
        throw new Error(`Upload failed with status ${response.status}`);
      }
      return response;
    }

    async load_data_from_url(url) {
      return await fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to download");
        }
        return response.blob();
      })
      .then(async (blob) => {
        const fileContent = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsText(blob);
        });
        
        // return the data loaded form the url
        return fileContent;
      })
      .catch(error => {
        console.error('Error:', error);
      });
    }
}