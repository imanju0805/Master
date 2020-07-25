import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
@Injectable({
  providedIn: "root",
})
export class StorageService {
  constructor(public storage: Storage) {
    console.log("Your storage provider is working here !");
  }
  async set(key: string, value: any): Promise<any> {
    try {
      const result = await this.storage.set(key, value);
      console.log("set string in storage: " + result);
      return true;
    } catch (reason) {
      console.log(reason);
      return false;
    }
  }
  async get(key: string): Promise<any> {
    try {
      const result = await this.storage.get(key);
      console.log("storageGET: " + key + ": " + result);
      if (result != null) {
        return result;
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }
  async setObject(key: string, object: Object) {
    try {
      const result = await this.storage.set(key, JSON.stringify(object));
      console.log("set Object in storage: " + result);
      return true;
    } catch (reason) {
      console.log(reason);
      return false;
    }
  }
  async setProfilePic(key: string, object: Object) {
    try {
      const result = await this.storage.set(key, JSON.stringify(object));
      console.log('set profile pic Object in storage: ' + result);
      return true;
    } catch (reason) {
      console.log(reason);
      return false;
    }
  }
  //get a profile pic
  async getProfilePic(key: string): Promise<any> {
    try {
      const result = await this.storage.get(key);
      if (result != null) {
        return JSON.parse(result);
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }
  // get a key/value object
  async getObject(key: string): Promise<any> {
    try {
      const result = await this.storage.get(key);
      console.log("storageGET: " + key + ": " + result);
      if (result != null) {
        return JSON.parse(result);
      }
      return null;
    } catch (reason) {
      console.log(reason);
      return null;
    }
  }
  // remove a single key value:
  remove(key: string) {
    this.storage.remove(key);
  }
  //  delete all data from your application:
  clear() {
    this.storage.clear();
    console.log("Storage Clears");
  }
}
