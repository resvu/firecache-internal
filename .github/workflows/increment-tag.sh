#Increase the version number from the package.json
increase_version_number(){
  #Get the current value from the package

  PACKAGE_VERSION=$(npm view @resvu/firecache-internal version)
  echo current package version $PACKAGE_VERSION

  #Separate the version number

  MAJOR=$(echo ${PACKAGE_VERSION} | cut -d. -f1)
  MINOR=$(echo ${PACKAGE_VERSION} | cut -d. -f2)
  PATCH=$(echo ${PACKAGE_VERSION} | cut -d. -f3)

  #increase the last value of the version

  if [[ $MAJOR == "" || $MINOR == "" || $PATCH == "" ]]; then
    echo "Invalid version format in package.json. Unable to increment version."
    exit 1
  fi

  PATCH=$((PATCH + 1))

  #Get the new version and update the package.json file

 export NEW_VERSION="$MAJOR.$MINOR.$PATCH"
 echo "NEW_VERSION=$NEW_VERSION" >> "$GITHUB_ENV"

}

increase_github_tag() {
  echo new version v$NEW_VERSION

  git config --local user.name "resvudevopsrobot"
  git config --local user.email "devops@resvu.io"

  git tag v$NEW_VERSION && git push --tags
}

increase_packagejson_version() {
  increase_version_number
  sed -i "s/\"version\": \".*\"/\"version\": \"$NEW_VERSION\"/" package.json
}